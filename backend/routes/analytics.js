const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/heatmap', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const logs = await prisma.auditLog.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, action: true },
    });

    const heatmap = {};
    logs.forEach((log) => {
      const day = log.createdAt.toISOString().slice(0, 10);
      const hour = log.createdAt.getHours();
      const key = `${day}-${hour}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    res.json({ heatmap, totalEvents: logs.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build heatmap' });
  }
});

module.exports = router;