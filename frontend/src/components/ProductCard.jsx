import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onAddToCart, showActions, onEdit, onDelete, isOwner, isAdmin }) {
  const { addToCart } = useCart();

  const imageUrl = product.ProductImage
    ? `data:${product.ImageType};base64,${btoa(
        new Uint8Array(product.ProductImage).reduce((d, b) => d + String.fromCharCode(b), '')
      )}`
    : null;

  const handleCart = () => {
    addToCart(product);
    if (onAddToCart) onAddToCart(product);
  };

  const price = Number(product.ProductPrice).toLocaleString('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Image */}
      <div style={{
        height: 200, background: 'rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.ProductName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem', opacity: 0.3 }}>📦</span>
        )}
        {product.ProductCategory && (
          <span className="badge badge-accent" style={{ position: 'absolute', top: 12, left: 12 }}>
            {product.ProductCategory}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
            {product.ProductName}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {product.ProductDescription?.slice(0, 80)}{product.ProductDescription?.length > 80 ? '…' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-light)' }}>{price}</span>
          <span style={{ fontSize: '0.78rem', color: product.ProductQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {product.ProductQuantity > 0 ? `${product.ProductQuantity} in stock` : 'Out of stock'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
          {/* Add to cart shown for all users on home page */}
          {!showActions && (
            <button
              id={`add-to-cart-${product.ProductId}`}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleCart}
              disabled={product.ProductQuantity === 0}
            >
              🛒 Add to Cart
            </button>
          )}

          {/* Owner actions */}
          {showActions && isOwner && (
            <>
              <button
                id={`edit-product-${product.ProductId}`}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => onEdit(product)}
              >
                ✏️ Edit
              </button>
              <button
                id={`delete-product-${product.ProductId}`}
                className="btn btn-danger btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => onDelete(product.ProductId)}
              >
                🗑️ Delete
              </button>
            </>
          )}

          {/* Admin can delete any product */}
          {showActions && !isOwner && isAdmin && (
            <button
              id={`admin-delete-${product.ProductId}`}
              className="btn btn-danger btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => onDelete(product.ProductId)}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
