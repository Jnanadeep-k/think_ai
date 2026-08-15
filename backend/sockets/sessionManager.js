// In-memory session tracking for real-time demo purposes.
// Placeholder until a real Session API exists — swap the storage
// layer for a DB/service call later without changing the event contract.

const activeSessions = new Map(); // sessionId -> { userId, roomName, startedAt, lastActivityAt }

function startSession(userId, roomName) {
  const sessionId = `sess-${userId}-${Date.now()}`;
  const session = {
    sessionId,
    userId,
    roomName,
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
  activeSessions.set(sessionId, session);
  return session;
}

function updateSession(sessionId, changes = {}) {
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  Object.assign(session, changes, { lastActivityAt: new Date().toISOString() });
  return session;
}

function endSession(sessionId, reason = 'ended') {
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  activeSessions.delete(sessionId);
  return { ...session, endedAt: new Date().toISOString(), reason };
}

function getSessionsForUser(userId) {
  return Array.from(activeSessions.values()).filter((s) => s.userId === userId);
}

module.exports = { startSession, updateSession, endSession, getSessionsForUser, activeSessions };