// src/api/liveSessionApi.js

const BASE = '/api/live-classes';

// Flip this to true once the backend endpoints exist.
const USE_MOCK = true;

const MOCK_CLASSES = [
  {
    id: 'cls_204',
    title: 'React Performance Patterns — Live Q&A',
    instructor: 'Priya Nair',
    startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // starts in 5 min
    durationMinutes: 60,
  },
  {
    id: 'cls_205',
    title: 'Intro to System Design',
    instructor: 'Arjun Mehta',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // in 2 hrs
    durationMinutes: 90,
  },
  {
    id: 'cls_206',
    title: 'CSS Grid Deep Dive',
    instructor: 'Sara Kim',
    startTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // started 20 min ago
    durationMinutes: 45,
  },
  {
    id: 'cls_207',
    title: 'Career Q&A: Breaking into Frontend',
    instructor: 'Priya Nair',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // ended
    durationMinutes: 60,
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

export async function fetchUpcomingClasses() {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_CLASSES;
  }
  const res = await fetch(`${BASE}?status=upcoming`);
  return parseJsonOrThrow(res, 'Could not load live classes.');
}

export async function fetchClassInfo(classId) {
  if (USE_MOCK) {
    await delay(300);
    const found = MOCK_CLASSES.find((c) => c.id === classId);
    if (!found) throw new Error('Class not found.');
    return found;
  }
  const res = await fetch(`${BASE}/${classId}`);
  return parseJsonOrThrow(res, 'Could not load class details.');
}

export async function joinSession(classId) {
  if (USE_MOCK) {
    await delay(500);
    return { joinUrl: `https://example.com/session/${classId}` };
  }
  const res = await fetch(`${BASE}/${classId}/join`, { method: 'POST' });
  return parseJsonOrThrow(res, "Couldn't join the class. Try again.");
}