import { useState, useEffect } from 'react';
import { getAllOrders } from '../api/orders';

const STATUS_BADGE = {
  PENDING: 'badge-warning',
  PROCESSING: 'badge-accent',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllOrders()
      .then((r) => setOrders(r.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Orders</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{orders.length} total</span>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No orders yet</div>
            <div className="empty-state-text">Orders placed by customers will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} className="glass-card" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                      Order #{order.orderId}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {order.CostumerName} · {order.EmailId}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span className={`badge ${STATUS_BADGE[order.Status] || 'badge-accent'}`}>
                      {order.Status}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {order.Date}
                    </span>
                  </div>
                </div>

                {order.Items && order.Items.length > 0 && (
                  <>
                    <hr className="divider" style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.Items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
                          <span>{item.productName} × {item.quantity}</span>
                          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
