import { useState, useEffect } from 'react';
import { getAllProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Food', 'Sports', 'Home', 'Other'];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [toast, setToast] = useState('');

  useEffect(() => {
    getAllProducts()
      .then((r) => setProducts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.ProductName?.toLowerCase().includes(search.toLowerCase()) ||
      p.ProductDescription?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.ProductCategory === category;
    return matchSearch && matchCat;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,110,242,0.15), rgba(34,211,238,0.08))',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          marginBottom: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(124,110,242,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <h1 className="page-title" style={{ fontSize: '2.8rem' }}>
            Discover Amazing Products
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, fontSize: '1.05rem', lineHeight: 1.7 }}>
            Shop from thousands of products. Buy, sell, and manage your store — all in one place.
          </p>
          {!isAuthenticated && (
            <a href="/register" className="btn btn-primary" style={{ marginTop: 8, padding: '12px 32px', fontSize: '1rem' }}>
              Start Selling →
            </a>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            id="home-search"
            type="text"
            className="form-input"
            style={{ flex: '1 1 260px', maxWidth: 360 }}
            placeholder="🔍  Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                id={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        <div style={{ marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {!loading && `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-text">Try a different search or category filter.</div>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.ProductId} product={p} onAddToCart={() => showToast(`${p.ProductName} added to cart!`)} />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--success)', color: 'var(--bg-base)',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 8px 32px rgba(52,211,153,0.4)',
          animation: 'fadeIn 0.3s ease',
          zIndex: 999, whiteSpace: 'nowrap',
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
