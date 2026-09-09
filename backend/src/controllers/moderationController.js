const Comment = require("../models/Comment");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
const Notification = require("../models/Notification");

function buildQueueItem(kind, item) {
    const author = User.findById(item.authorId);
    return {
        id: item.id,
        type: kind,
        title: kind === "discussion" ? item.title : `Comment on discussion ${item.discussionId}`,
        excerpt:
            kind === "discussion"
                ? String(item.body).slice(0, 160)
                : String(item.body).slice(0, 160),
        reason: item.flagReason,
        flaggedAt: item.updatedAt || item.createdAt,
        hidden: Boolean(item.hidden),
        authorName: author ? author.name : "Unknown user",
        authorId: item.authorId
    };
}

function flaggedQueue(_req, res) {
    const discussionItems = Discussion.listAll()
        .filter((d) => d.flagged)
        .map((d) => buildQueueItem("discussion", d));
    const commentItems = Comment.listAll()
        .filter((c) => c.flagged)
        .map((c) => buildQueueItem("comment", c));
    res.status(200).json({ success: true, data: [...discussionItems, ...commentItems] });
}

function listUsers(_req, res) {
    res.status(200).json({ success: true, data: User.list() });
}

function banUser(req, res) {
    const user = User.setBanned(req.params.id, true);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    Notification.create({
        userId: req.params.id,
        type: "moderation",
        message: "Your account has been banned by a moderator.",
        link: "/forum"
    });
    res.status(200).json({ success: true, data: user });
}

function unbanUser(req, res) {
    const user = User.setBanned(req.params.id, false);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    Notification.create({
        userId: req.params.id,
        type: "moderation",
        message: "Your account has been unbanned.",
        link: "/forum"
    });
    res.status(200).json({ success: true, data: user });
}

function warnUser(req, res) {
    const user = User.setWarned(req.params.id, true);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    Notification.create({
        userId: req.params.id,
        type: "moderation",
        message: "You have received a warning from a moderator.",
        link: "/forum"
    });
    res.status(200).json({ success: true, data: user });
}

function muteUser(req, res) {
    const { muted } = req.body || {};
    const user = User.setMuted(req.params.id, muted !== false);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    Notification.create({
        userId: req.params.id,
        type: "moderation",
        message: muted !== false ? "You have been muted." : "You have been unmuted.",
        link: "/forum"
    });
    res.status(200).json({ success: true, data: user });
}

function getAuditLog(_req, res) {
    res.status(200).json({ success: true, data: User.getAuditLog() });
}

function setContentVisibility(req, res) {
    const { type, hidden } = req.body || {};
    const id = req.params.id;
    if (!["discussion", "comment"].includes(type)) {
        return res.status(400).json({ success: false, message: "type must be 'discussion' or 'comment'" });
    }
    const updated =
        type === "discussion" ? Discussion.setHidden(id, Boolean(hidden)) : Comment.setHidden(id, Boolean(hidden));
    if (!updated) {
        return res.status(404).json({ success: false, message: `${type} not found` });
    }
    User.logAuditAction({ type: hidden ? "hide_content" : "show_content", targetContentId: id, contentType: type });
    res.status(200).json({
        success: true,
        data: { id, type, hidden: Boolean(updated.hidden) }
    });
}

function resolveContent(req, res) {
    const { type } = req.body || {};
    const id = req.params.id;
    const updated =
        type === "discussion" ? Discussion.setFlagged(id, false) : Comment.setFlagged(id, false);
    if (!updated) {
        return res.status(404).json({ success: false, message: `${type} not found` });
    }
    User.logAuditAction({ type: "resolve_flag", targetContentId: id, contentType: type });
    res.status(200).json({ success: true, data: { id, type, resolved: true } });
}

function hiddenContent(_req, res) {
    const items = [
        ...Discussion.listAll()
            .filter((d) => d.hidden)
            .map((d) => buildQueueItem("discussion", d)),
        ...Comment.listAll()
            .filter((c) => c.hidden)
            .map((c) => buildQueueItem("comment", c))
    ];
    res.status(200).json({ success: true, data: items });
}

module.exports = { flaggedQueue, hiddenContent, listUsers, banUser, unbanUser, warnUser, muteUser, setContentVisibility, resolveContent, getAuditLog };
