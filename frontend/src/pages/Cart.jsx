import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ CostumerName: '', EmailId: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setError('');
    setLoading(true);
    try {
      const orderRequest = { CostumerName: form.CostumerName, EmailId: form.EmailId };
      const orderItemRequest = {
        items: cartItems.map((i) => ({
          productId: i.ProductId,
          productName: i.ProductName,
          quantity: i.qty,
          price: i.ProductPrice,
        })),
      };
      await placeOrder(orderRequest, orderItemRequest);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 500 }}>
          <div className="glass-card fade-in-scale" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px var(--success))' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>Order Placed!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Your order has been placed successfully. You'll receive a confirmation soon.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => navigate('/orders')}>View Orders</button>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--danger)' }}>
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-title">Your cart is empty</div>
            <div className="empty-state-text">Browse products and add them to your cart.</div>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cartItems.map((item) => {
                const itemTotal = (Number(item.ProductPrice) * item.qty).toLocaleString('en-IN', {
                  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
                });
                return (
                  <div key={item.ProductId} className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 70, height: 70, borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', flexShrink: 0, overflow: 'hidden',
                    }}>
                      {item.ProductImage ? '🖼️' : '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{item.ProductName}</div>
                      <div style={{ color: 'var(--accent-light)', fontWeight: 600, fontSize: '0.9rem' }}>
                        ₹{Number(item.ProductPrice).toLocaleString()} each
                      </div>
                    </div>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm btn-icon"
                        onClick={() => updateQty(item.ProductId, item.qty - 1)}>−</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                      <button className="btn btn-secondary btn-sm btn-icon"
                        onClick={() => updateQty(item.ProductId, item.qty + 1)}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: 80, textAlign: 'right' }}>
                      {itemTotal}
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={() => removeFromCart(item.ProductId)}
                      style={{ color: 'var(--danger)', fontSize: '1rem' }}>✕</button>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: 88 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Shipping</span><span style={{ color: 'var(--success)' }}>Free</span>
              </div>
              <hr className="divider" style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontWeight: 800, fontSize: '1.15rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-light)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: 16, fontSize: '0.82rem' }}>{error}</div>}

              <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="cart-name">Full Name</label>
                  <input id="cart-name" name="CostumerName" type="text" className="form-input"
                    placeholder="John Doe" value={form.CostumerName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cart-email">Email</label>
                  <input id="cart-email" name="EmailId" type="email" className="form-input"
                    placeholder="john@example.com" value={form.EmailId} onChange={handleChange} required />
                </div>
                <button id="place-order-btn" type="submit" className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                  {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Placing…</> : '🛍️ Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
