import AsyncStorage from '@react-native-async-storage/async-storage';
import { readAuthToken, writeAuthToken, deleteAuthToken } from '@/lms/authStorage';

/**
 * Identity for the forum/payments HTTP layer (Pages 6–10).
 *
 * The backend resolves the caller from the `x-user-id` header (falling back to
 * a demo user), so the app only has to remember *who* is signed in. State is
 * mirrored in AsyncStorage so the id survives a relaunch, and every mutation is
 * published to subscribers — `useBookmarks` re-syncs on sign-in / sign-out.
 */

export const DEFAULT_USER_ID = 'u1';

const USER_ID_KEY = 'thinkz_forum_user_id';

export interface SessionState {
  userId: string;
  /** Optional bearer token for the LMS-side endpoints. `null` when signed out. */
  token: string | null;
  isSignedIn: boolean;
}

type SessionListener = (session: SessionState) => void;

let session: SessionState = {
  userId: DEFAULT_USER_ID,
  token: null,
  isSignedIn: false,
};

const listeners = new Set<SessionListener>();
let restorePromise: Promise<SessionState> | null = null;

function publish(next: SessionState): void {
  session = next;
  listeners.forEach((listener) => listener(session));
}

export function getSession(): SessionState {
  return session;
}

/** Subscribes to sign-in / sign-out / user-switch events. Returns unsubscribe. */
export function subscribeToSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Loads the persisted identity exactly once. Every request awaits this so the
 * first `x-user-id` header already reflects the stored user.
 */
export function restoreSession(): Promise<SessionState> {
  if (restorePromise === null) {
    restorePromise = Promise.all([
      AsyncStorage.getItem(USER_ID_KEY),
      readAuthToken(),
    ])
      .then(([userId, token]) => {
        const next: SessionState = {
          userId: userId ?? DEFAULT_USER_ID,
          token: token,
          // Preserve the existing forum/navigation identity semantics. LMS
          // screens independently require the bearer token for API access.
          isSignedIn: userId !== null,
        };
        session = next;
        return next;
      })
      .catch(() => session);
  }
  return restorePromise;
}

export async function signIn(userId: string, token?: string | null): Promise<SessionState> {
  const trimmed = userId.trim() || DEFAULT_USER_ID;
  // Fail sign-in if the authenticated session cannot be securely persisted.
  if (token) await writeAuthToken(token);
  else await deleteAuthToken();
  try {
    await AsyncStorage.setItem(USER_ID_KEY, trimmed);
    await AsyncStorage.removeItem('thinkz_auth_token');
  } catch {
    // Storage failures must never block sign-in — the in-memory state still publishes.
  }
  publish({ userId: trimmed, token: token ?? null, isSignedIn: true });
  return session;
}

export async function signOut(): Promise<SessionState> {
  // Do not claim a persistent sign-out if secure token removal fails.
  await deleteAuthToken();
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
    await AsyncStorage.removeItem('thinkz_auth_token');
  } catch {
    // Same rationale as signIn — keep going with the in-memory reset.
  }
  publish({ userId: DEFAULT_USER_ID, token: null, isSignedIn: false });
  return session;
}

/** Test seam: resets module state between suites. */
export function __resetSessionForTests(): void {
  session = { userId: DEFAULT_USER_ID, token: null, isSignedIn: false };
  restorePromise = null;
  listeners.clear();
}
