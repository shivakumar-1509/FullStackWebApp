import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../api/products';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function MyProducts() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ msg: '', type: '' });

  const fetchProducts = () => {
    setLoading(true);
    getMyProducts()
      .then((r) => setProducts(r.data))
      .catch(() => setError('Failed to load your products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.ProductId !== id));
      showToast('Product deleted successfully.');
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.ProductId}`, { state: { product } });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Products</h1>
          <button
            id="add-product-btn"
            className="btn btn-primary"
            onClick={() => navigate('/products/add')}
          >
            + Add Product
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No products yet</div>
            <div className="empty-state-text">Add your first product to start selling.</div>
            <button className="btn btn-primary" onClick={() => navigate('/products/add')}>
              + Add Product
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} listed
            </div>
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.ProductId}
                  product={p}
                  showActions={true}
                  isOwner={true}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {toast.msg && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'var(--bg-base)',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease', zIndex: 999, whiteSpace: 'nowrap',
        }}>
          {toast.type === 'error' ? '✗' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  );
}
