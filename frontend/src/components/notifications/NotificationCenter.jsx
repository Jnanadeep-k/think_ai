import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
} from '../../features/notifications/notificationSlice';

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const TYPE_ICONS = {
  assignment: '📝',
  live_class: '🔴',
  certificate: '🎓',
  default: '🔔',
};

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationsLoading);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(loadNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => setOpen((prev) => !prev);

  const handleItemClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification.id));
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleBellClick}
        aria-label="Notifications"
        className="relative p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(320px,calc(100vw-2rem))] max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[#151025] shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {loading && (
            <p className="px-4 py-6 text-center text-xs text-slate-400">Loading…</p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-slate-400">No notifications yet.</p>
          )}

          {!loading &&
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors hover:bg-white/5 ${
                  !n.read ? 'bg-cyan-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none mt-0.5">
                    {TYPE_ICONS[n.type] || TYPE_ICONS.default}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />}
                      <p className="text-sm font-medium text-slate-200 truncate">{n.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}