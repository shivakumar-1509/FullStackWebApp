import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/products';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Food', 'Sports', 'Home', 'Other'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ProductName: '', ProductPrice: '', ProductQuantity: '', ProductCategory: '', ProductDescription: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      const blob = new Blob([JSON.stringify(form)], { type: 'application/json' });
      fd.append('product', blob);          // must match @RequestPart("product")
      if (image) fd.append('file', image); // file is optional on the backend
      await addProduct(fd);
      navigate('/my-products');
    } catch (err) {
      setError(err.response?.data || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-header">
          <h1 className="page-title">Add Product</h1>
          <button className="btn btn-ghost" onClick={() => navigate('/my-products')}>← Back</button>
        </div>

        <div className="glass-card" style={{ padding: '36px' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-name">Product Name</label>
              <input id="add-name" name="ProductName" type="text" className="form-input"
                placeholder="e.g. Wireless Headphones" value={form.ProductName} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="add-price">Price (₹)</label>
                <input id="add-price" name="ProductPrice" type="number" step="0.01" className="form-input"
                  placeholder="0.00" value={form.ProductPrice} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="add-qty">Quantity</label>
                <input id="add-qty" name="ProductQuantity" type="number" className="form-input"
                  placeholder="0" value={form.ProductQuantity} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-category">Category</label>
              <select id="add-category" name="ProductCategory" className="form-select"
                value={form.ProductCategory} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-description">Description</label>
              <textarea id="add-description" name="ProductDescription" className="form-textarea"
                placeholder="Describe your product…" value={form.ProductDescription} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Product Image (optional)</label>
              <label className="form-file-label" htmlFor="add-image">
                {image ? `📷 ${image.name}` : '📷 Click to upload image'}
                <input id="add-image" type="file" className="form-file-input"
                  accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-products')}>
                Cancel
              </button>
              <button id="add-product-submit" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Adding…</> : '+ Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
