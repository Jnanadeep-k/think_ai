import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUser } from '../../features/auth/authSlice';
import {
  loadPreferences,
  savePreferences,
  selectPreferences,
  selectPreferencesLoading,
  selectPreferencesSaving,
} from '../../features/preferences/preferencesSlice';

const CHANNELS = [
  { key: 'emailEnabled', label: 'Email' },
  { key: 'smsEnabled', label: 'SMS' },
  { key: 'pushEnabled', label: 'Push notifications' },
];

const CATEGORIES = [
  { key: 'courseUpdates', label: 'Course updates' },
  { key: 'forumReplies', label: 'Forum replies' },
  { key: 'paymentAlerts', label: 'Payment alerts' },
  { key: 'systemAnnouncements', label: 'System announcements' },
];

export default function NotificationPreferencesPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const preferences = useSelector(selectPreferences);
  const loading = useSelector(selectPreferencesLoading);
  const saving = useSelector(selectPreferencesSaving);

  const [local, setLocal] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(loadPreferences(user.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (preferences) setLocal(preferences);
  }, [preferences]);

  const toggleChannel = (key) => {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (key) => {
    setLocal((prev) => ({
      ...prev,
      categories: { ...prev.categories, [key]: !prev.categories[key] },
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(savePreferences({ userId: user.id, updates: local })).unwrap();
      toast.success('Preferences saved', { theme: 'dark' });
    } catch (err) {
      toast.error(err || 'Failed to save preferences', { theme: 'dark' });
    }
  };

  if (!user?.id) {
    return <div className="p-6 text-sm text-neutral-400">Loading account…</div>;
  }
  if (loading || !local) {
    return <div className="p-6 text-sm text-neutral-400">Loading preferences…</div>;
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Notification Preferences</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Choose how and what you're notified about.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
          Channels
        </h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {CHANNELS.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between px-5 py-4 cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">{label}</span>
              <input
                type="checkbox"
                checked={!!local[key]}
                onChange={() => toggleChannel(key)}
                className="h-4 w-4"
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
          Categories
        </h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {CATEGORIES.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between px-5 py-4 cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">{label}</span>
              <input
                type="checkbox"
                checked={!!local.categories?.[key]}
                onChange={() => toggleCategory(key)}
                className="h-4 w-4"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-lg bg-[var(--accent-to)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save preferences'}
      </button>
    </div>
  );
}