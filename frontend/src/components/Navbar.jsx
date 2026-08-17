import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">ShopHub</span>
        </Link>

        {/* Links */}
        <div className="navbar-links">
          <Link to="/" id="nav-home" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/my-products" id="nav-my-products" className={`nav-link ${isActive('/my-products') ? 'active' : ''}`}>
                My Products
              </Link>
              <Link to="/orders" id="nav-orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                Orders
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <NotificationBell />

              {/* Cart */}
              <Link to="/cart" id="nav-cart" className="btn btn-ghost btn-icon" style={{ position: 'relative', fontSize: '1.2rem' }}>
                🛒
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    background: 'var(--teal)', color: 'var(--bg-base)',
                    borderRadius: '50%', fontSize: '0.62rem', fontWeight: 700,
                    width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile + Logout */}
              <Link to="/profile" id="nav-profile" className="btn btn-ghost btn-icon" title={user?.username}>
                👤
              </Link>
              <button id="nav-logout" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" id="nav-login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" id="nav-register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
