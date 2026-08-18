// Local mock data store (No database)
let sessions = [];
let attendance = [];

/**
 * 1. Create a New Live Session
 * POST /api/v1/sessions
 */
const createSession = async (req, res) => {
    try {
        const { title, instructorId, startTime, endTime } = req.body;

        // Validate required fields
        if (!title || !instructorId || !startTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newSession = {
            id: Date.now().toString(), // Generate a unique ID string
            title,
            instructorId,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            status: 'SCHEDULED', // Default initial status
            meetingLink: null,
            recordingUrl: null,
            createdAt: new Date()
        };

        sessions.push(newSession);
        return res.status(201).json(newSession);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create session' });
    }
};

/**
 * 2. Fetch a Single Session with Attendance
 * GET /api/v1/sessions/:id
 */
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = sessions.find(s => s.id === id); // Cut off at "s =>"

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Filter attendance records specifically for this session
        const sessionAttendance = attendance.filter(a => a.sessionId === id); // Cut off at "attendan"
        res.status(200).json({ ...session, attendance: sessionAttendance });
    } catch (error) {
        res.status(500).json({ error: 'Failed' }); 
    }
};

/**
 * 3. Update Session Status or Details
 * PUT /api/v1/sessions/:id
 */
const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime, status, meetingLink, recordingUrl } = req.body;

        const sessionIndex = sessions.findIndex(s => s.id === id);
        if (sessionIndex === -1) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Update individual values dynamically
        if (title) sessions[sessionIndex].title = title;
        if (startTime) sessions[sessionIndex].startTime = new Date(startTime);
        if (endTime) sessions[sessionIndex].endTime = new Date(endTime);
        if (status) sessions[sessionIndex].status = status;
        if (meetingLink) sessions[sessionIndex].meetingLink = meetingLink;
        if (recordingUrl) sessions[sessionIndex].recordingUrl = recordingUrl;

         res.status(200).json(sessions[sessionIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update session' });
    }
};

/**
 * 4. Cancel / Delete a Session
 * DELETE /api/v1/sessions/:id
 */
const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionIndex = sessions.findIndex(s => s.id === id);

        if (sessionIndex === -1) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Remove the target session entry from the array
        sessions.splice(sessionIndex, 1);
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

// Export all the middleware handlers
module.exports = {
    createSession,
    getSessionById,
    updateSession,
    deleteSession
};