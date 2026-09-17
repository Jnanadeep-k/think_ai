const Comment = require("../models/Comment");
const Discussion = require("../models/Discussion");
const notificationService = require("../services/notificationService");

const BODY_MIN = 2;
const BODY_MAX = 5000;

function isModerator(user) {
    return user && ["Moderator", "Admin"].includes(user.role);
}

function listByDiscussion(req, res) {
    const discussion = Discussion.findById(req.params.discussionId);
    if (!discussion) {
        return res.status(404).json({ success: false, message: "Discussion not found" });
    }
    const includeHidden = isModerator(req.user);
    res.status(200).json({ success: true, data: Comment.findByDiscussion(req.params.discussionId, includeHidden) });
}

function create(req, res) {
    const discussion = Discussion.findById(req.params.discussionId || req.body.discussionId);
    if (!discussion) {
        return res.status(404).json({ success: false, message: "Discussion not found" });
    }

    const body = String(req.body.body || "").trim();
    const errors = {};
    if (!body) errors.body = "Comment body is required";
    else if (body.length < BODY_MIN) errors.body = `Comment must be at least ${BODY_MIN} characters`;
    else if (body.length > BODY_MAX) errors.body = `Comment must be at most ${BODY_MAX} characters`;
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const comment = Comment.create({
        discussionId: discussion.id,
        parentId: req.body.parentId,
        body,
        authorId: req.user.id
    });

    const mentionNotifications = notificationService.notifyMentions({
        text: body,
        authorId: req.user.id,
        message: `${req.user.username} mentioned you in a comment on "${discussion.title}"`,
        link: `/forum/${discussion.id}`
    });

    if (discussion.authorId !== req.user.id) {
        notificationService.notifyReply({
            discussionAuthorId: discussion.authorId,
            replierName: req.user.name || req.user.username,
            discussionId: discussion.id,
            discussionTitle: discussion.title
        });
    }

    res.status(201).json({
        success: true,
        data: Comment.serialize(comment),
        notificationsCreated: mentionNotifications.length
    });
}

module.exports = { listByDiscussion, create };
