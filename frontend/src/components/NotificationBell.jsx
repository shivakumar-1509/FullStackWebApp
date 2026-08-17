import { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markRead, markAllRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/auth';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [sellerId, setSellerId] = useState(null);
  const ref = useRef(null);

  // Fetch profile to get sellerId
  useEffect(() => {
    if (!isAuthenticated) return;
    getProfile()
      .then((res) => setSellerId(res.data.id))
      .catch(() => {});
  }, [isAuthenticated]);

  // Poll unread count
  useEffect(() => {
    if (!sellerId) return;
    const fetch = () =>
      getUnreadCount(sellerId)
        .then((r) => setUnread(r.data))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [sellerId]);

  const openDropdown = () => {
    if (!sellerId) return;
    setOpen((o) => !o);
    getNotifications(sellerId).then((r) => setNotifications(r.data));
  };

  const handleMarkAll = async () => {
    if (!sellerId) return;
    await markAllRead(sellerId);
    setUnread(0);
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
  };

  const handleMark = async (id) => {
    await markRead(id);
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, isRead: true } : x)));
    setUnread((u) => Math.max(0, u - 1));
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        id="notification-bell-btn"
        className="btn btn-ghost btn-icon"
        onClick={openDropdown}
        style={{ position: 'relative', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: 'var(--accent)', color: '#fff',
            borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700,
            width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="slide-down" style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          width: 340, maxHeight: 420, overflowY: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 200,
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
            {unread > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={handleMarkAll} style={{ fontSize: '0.78rem' }}>
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMark(n.id)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: n.isRead ? 'default' : 'pointer',
                  background: n.isRead ? 'transparent' : 'rgba(124,110,242,0.06)',
                  transition: 'background 0.2s',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '0.6rem', marginTop: 5, color: n.isRead ? 'transparent' : 'var(--accent)', flexShrink: 0 }}>●</span>
                <div>
                  <div style={{ fontSize: '0.87rem', color: n.isRead ? 'var(--text-muted)' : 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
