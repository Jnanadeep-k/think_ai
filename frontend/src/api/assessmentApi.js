const BASE = '/api/assessments';

// Flip to false once the backend endpoints exist.
const USE_MOCK = true;

const MOCK_ASSIGNMENTS = [
  {
    id: 'asgn_1',
    title: 'Frontend Fundamentals — Quiz 3',
    courseTitle: 'Frontend Fundamentals',
    status: 'pending',
    dueDate: '2026-08-20T23:59:00Z',
  },
  {
    id: 'asgn_2',
    title: 'Component Architecture Essay',
    courseTitle: 'Frontend Fundamentals',
    status: 'graded',
    dueDate: '2026-08-05T23:59:00Z',
    score: 92,
  },
  {
    id: 'asgn_3',
    title: 'API Integration Lab',
    courseTitle: 'Backend Basics',
    status: 'overdue',
    dueDate: '2026-08-10T23:59:00Z',
  },
];

export async function fetchAssignments() {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_ASSIGNMENTS;
  }
  const res = await fetch(`${BASE}/assignments`);
  return parseJsonOrThrow(res, 'Could not load assignments.');
}

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

export async function fetchAssessment(assessmentId) {
  if (USE_MOCK) {
    await delay(400);
    const found = MOCK_ASSESSMENTS[assessmentId] || Object.values(MOCK_ASSESSMENTS)[0];
    if (!found) throw new Error('Assessment not found.');
    return found;
  }
  const res = await fetch(`${BASE}/${assessmentId}`);
  return parseJsonOrThrow(res, 'Could not load assessment.');
}

export async function autosaveAnswers(assessmentId, answers) {
  if (USE_MOCK) {
    await delay(200);
    console.log('[mock autosave]', assessmentId, answers);
    return { ok: true };
  }
  const res = await fetch(`${BASE}/${assessmentId}/autosave`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  return parseJsonOrThrow(res, 'Autosave failed.');
}

export async function submitAssessment(assessmentId, answers) {
  if (USE_MOCK) {
    await delay(500);
    console.log('[mock submit]', assessmentId, answers);
    return { ok: true };
  }
  const res = await fetch(`${BASE}/${assessmentId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  return parseJsonOrThrow(res, 'Submit failed.');
}