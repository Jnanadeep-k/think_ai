const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logAction({ userId, action, targetType, targetId, metadata }) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, targetType, targetId, metadata },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

module.exports = { logAction };