// ASSUMPTIONS — replace once Pod B's real contract is shared:
// - Pod B owns/produces notification events (assignment posted, live class
//   starting, grade published, etc.) that this app consumes.
// - GET /api/pod-b/notifications  -> same shape as notificationApi's list
// - Real-time delivery likely arrives via the existing Socket.IO server
//   under an event name Pod B defines — not confirmed, so not wired yet.

const BASE = '/api/pod-b';
const USE_MOCK = true;

const MOCK_POD_B_EVENTS = [
  {
    id: 'pb1',
    title: 'Grade published',
    message: 'Your grade for CSS Layout Challenge is now available.',
    type: 'grade',
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'pb2',
    title: 'Batch schedule updated',
    message: 'Java — Batch A start time moved to 10:00 AM.',
    type: 'schedule',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseJsonOrThrow(res, fallbackMessage) {
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    throw new Error(fallbackMessage);
  }
  return res.json();
}

export async function fetchPodBNotifications() {
  if (USE_MOCK) {
    await delay(300);
    return MOCK_POD_B_EVENTS;
  }
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJsonOrThrow(res, 'Failed to load Pod B notifications.');
}