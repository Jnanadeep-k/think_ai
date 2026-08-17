const jwt = require('jsonwebtoken');
const disconnectedUsers = new Map(); // userId -> { rooms: Set, disconnectedAt, timeoutHandle }
const RECONNECT_GRACE_MS = 30000; // 30 seconds to reconnect before we consider them gone
// In-memory connection state tracking (swap for Redis later if needed)
const activeConnections = new Map(); // socketId -> { userId, role, rooms: Set, connectedAt }
const roomMembers = new Map();       // roomName -> Set of socketIds
const EVENTS = require('./events');
const sessionManager = require('./sessionManager');
module.exports = function (io) {
  // ---- AUTH MIDDLEWARE ----
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
      const demoRole = socket.handshake.headers['x-demo-role']; // same pattern as REST role-filtering

      if (token) {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        socket.user = { id: decoded.id || decoded.userId, role: decoded.role };
      } else if (demoRole) {
        const demoUserId = socket.handshake.headers['x-demo-user-id'] || `demo-${socket.id}`;
        // TEMP fallback for local/demo testing — mirrors REST x-demo-role pattern
        socket.user = { id: demoUserId, role: demoRole };
      } else {
        // TEMP: allow anonymous connection for now so frontend devs aren't blocked
        socket.user = { id: `anon-${socket.id}`, role: 'guest' };
      }

      next();
    } catch (err) {
      next(new Error('Authentication failed: ' + err.message));
    }
  });

  // ---- CONNECTION HANDLER ----
  io.on('connection', (socket) => {
    const { id: userId, role } = socket.user;

    // Check if this user is reconnecting within the grace period
    if (disconnectedUsers.has(userId)) {
      const prevState = disconnectedUsers.get(userId);
      clearTimeout(prevState.timeoutHandle);
      disconnectedUsers.delete(userId);

      // Rejoin their previous rooms automatically
      prevState.rooms.forEach((roomName) => {
        socket.join(roomName);
        if (!roomMembers.has(roomName)) roomMembers.set(roomName, new Set());
        roomMembers.get(roomName).add(socket.id);
        socket.to(roomName).emit(EVENTS.ROOM_USER_JOINED, { userId, socketId: socket.id, roomName, reconnected: true });
      });

      activeConnections.set(socket.id, {
        userId,
        role,
        rooms: new Set(prevState.rooms),
        connectedAt: new Date().toISOString(),
      });

      socket.emit(EVENTS.CONNECTION_STATE_CHANGED, { socketId: socket.id, userId, status: 'reconnected', timestamp: new Date().toISOString() });
      console.log(`[socket] RECONNECTED: ${socket.id} (user=${userId}) — restored ${prevState.rooms.size} room(s)`);
    } else {
      activeConnections.set(socket.id, {
        userId,
        role,
        rooms: new Set(),
        connectedAt: new Date().toISOString(),
      });
      console.log(`[socket] connected: ${socket.id} (user=${userId}, role=${role})`);
    }
    // ---- ROOM: JOIN ----
    socket.on(EVENTS.ROOM_JOIN, (roomName, ack) => {
      if (!roomName || typeof roomName !== 'string') {
        return ack?.({ ok: false, error: 'Invalid room name' });
      }

      socket.join(roomName);
      activeConnections.get(socket.id)?.rooms.add(roomName);

      if (!roomMembers.has(roomName)) roomMembers.set(roomName, new Set());
      roomMembers.get(roomName).add(socket.id);

      socket.to(roomName).emit(EVENTS.ROOM_USER_JOINED, { userId, socketId: socket.id, roomName });
      const session = sessionManager.startSession(userId, roomName);
      socket.emit(EVENTS.SESSION_STARTED, session);
      ack?.({ ok: true, roomName, memberCount: roomMembers.get(roomName).size });

      console.log(`[socket] ${socket.id} joined room "${roomName}"`);
    });

    // ---- ROOM: LEAVE ----
    socket.on(EVENTS.ROOM_LEAVE, (roomName, ack) => {
      socket.leave(roomName);
      activeConnections.get(socket.id)?.rooms.delete(roomName);
      roomMembers.get(roomName)?.delete(socket.id);

      socket.to(roomName).emit(EVENTS.ROOM_USER_LEFT, { userId, socketId: socket.id, roomName });
      const userSessions = sessionManager.getSessionsForUser(userId).filter((s) => s.roomName === roomName);
      userSessions.forEach((s) => {
        const ended = sessionManager.endSession(s.sessionId, 'left_room');
        socket.emit(EVENTS.SESSION_ENDED, ended);
      });
      ack?.({ ok: true, roomName });

      console.log(`[socket] ${socket.id} left room "${roomName}"`);
    });

    // ---- USER ACTIVITY ----
    socket.on(EVENTS.USER_ACTIVITY, (payload) => {
      const { roomName, action } = payload || {};
      if (!roomName || !action) return;

      socket.to(roomName).emit(EVENTS.USER_ACTIVITY, { userId, socketId: socket.id, roomName, action, timestamp: new Date().toISOString() });

      const userSessions = sessionManager.getSessionsForUser(userId).filter((s) => s.roomName === roomName);
      userSessions.forEach((s) => sessionManager.updateSession(s.sessionId, { lastAction: action }));
    });
    
    // ---- DISCONNECT: start grace period (may be a reconnect) ----
    socket.on('disconnect', (reason) => {
      const conn = activeConnections.get(socket.id);
      if (conn) {
        // Remove from room member lists immediately (so counts are accurate)
        conn.rooms.forEach((roomName) => {
          roomMembers.get(roomName)?.delete(socket.id);
        });

        // Hold their room membership in a grace window in case they reconnect
        const timeoutHandle = setTimeout(() => {
          conn.rooms.forEach((roomName) => {
            socket.to(roomName).emit(EVENTS.ROOM_USER_LEFT, { userId, socketId: socket.id, roomName });
          });
          disconnectedUsers.delete(userId);
          console.log(`[socket] grace period expired for user=${userId} — fully removed`);
        }, RECONNECT_GRACE_MS);

        disconnectedUsers.set(userId, { rooms: conn.rooms, disconnectedAt: new Date().toISOString(), timeoutHandle });
      }
      activeConnections.delete(socket.id);
      console.log(`[socket] disconnected: ${socket.id} (reason: ${reason}) — grace period started`);
    });
  });

  // Expose state for the connection state API (next step)
  return { activeConnections, roomMembers };
};