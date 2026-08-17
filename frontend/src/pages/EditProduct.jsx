import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateProduct } from '../api/products';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Food', 'Sports', 'Home', 'Other'];

export default function EditProduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;

  const [form, setForm] = useState({
    ProductName: product?.ProductName || '',
    ProductPrice: product?.ProductPrice || '',
    ProductQuantity: product?.ProductQuantity || '',
    ProductCategory: product?.ProductCategory || '',
    ProductDescription: product?.ProductDescription || '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) {
    navigate('/my-products');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      const blob = new Blob([JSON.stringify(form)], { type: 'application/json' });
      fd.append('request', blob);
      fd.append('file', image || new Blob([]), image?.name || 'empty.png');
      await updateProduct(product.ProductId, fd);
      navigate('/my-products');
    } catch (err) {
      setError(err.response?.data || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-header">
          <h1 className="page-title">Edit Product</h1>
          <button className="btn btn-ghost" onClick={() => navigate('/my-products')}>← Back</button>
        </div>

        <div className="glass-card" style={{ padding: '36px' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">Product Name</label>
              <input id="edit-name" name="ProductName" type="text" className="form-input"
                value={form.ProductName} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-price">Price (₹)</label>
                <input id="edit-price" name="ProductPrice" type="number" step="0.01" className="form-input"
                  value={form.ProductPrice} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-qty">Quantity</label>
                <input id="edit-qty" name="ProductQuantity" type="number" className="form-input"
                  value={form.ProductQuantity} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">Category</label>
              <select id="edit-category" name="ProductCategory" className="form-select"
                value={form.ProductCategory} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-description">Description</label>
              <textarea id="edit-description" name="ProductDescription" className="form-textarea"
                value={form.ProductDescription} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Update Image</label>
              <label className="form-file-label" htmlFor="edit-image">
                {image ? `📷 ${image.name}` : '📷 Click to upload new image'}
                <input id="edit-image" type="file" className="form-file-input"
                  accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-products')}>
                Cancel
              </button>
              <button id="edit-product-submit" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</> : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
