const BASE = '/api/notifications';
const USE_MOCK = true;

let MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'New assignment posted',
    message: 'React Hooks — Practice Set is now available.',
    read: false,
    type: 'assignment',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    title: 'Live class starting soon',
    message: 'React Performance Patterns starts in 10 minutes.',
    read: false,
    type: 'live_class',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Certificate ready',
    message: 'Your certificate for Frontend Fundamentals is ready to download.',
    read: true,
    type: 'certificate',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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

export async function fetchNotifications() {
  if (USE_MOCK) {
    await delay(300);
    return [...MOCK_NOTIFICATIONS].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  const token = localStorage.getItem('token');
  const res = await fetch(BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJsonOrThrow(res, 'Failed to load notifications.');
}

export async function markAsRead(id) {
  if (USE_MOCK) {
    await delay(150);
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return { id, read: true };
  }
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJsonOrThrow(res, 'Failed to mark notification as read.');
}

export async function markAllAsRead() {
  if (USE_MOCK) {
    await delay(200);
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map((n) => ({ ...n, read: true }));
    return { success: true };
  }
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJsonOrThrow(res, 'Failed to mark all as read.');
}