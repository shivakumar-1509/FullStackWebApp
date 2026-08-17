import { useState, useEffect } from 'react';
import { getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile()
      .then((r) => setProfile(r.data))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initial = profile ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() : '?';

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="page-title" style={{ marginBottom: 32 }}>My Profile</h1>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : profile && (
          <>
            {/* Avatar card */}
            <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24, textAlign: 'center' }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: '#fff',
                boxShadow: 'var(--shadow-accent)',
              }}>
                {initial}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.firstName} {profile.lastName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{profile.username}</p>
              </div>
              <span className={`badge ${profile.role === 'ADMIN' ? 'badge-warning' : 'badge-accent'}`}>
                {profile.role}
              </span>
            </div>

            {/* Details */}
            <div className="glass-card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'First Name', value: profile.firstName },
                { label: 'Last Name', value: profile.lastName },
                { label: 'Email', value: profile.email },
                { label: 'Username', value: profile.username },
                { label: 'Role', value: profile.role },
                { label: 'Products Listed', value: profile.products?.length ?? 0 },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--glass-border)' : 'none',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/my-products')} id="profile-my-products">
                📦 My Products
              </button>
              <button className="btn btn-danger" onClick={handleLogout} id="profile-logout">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
