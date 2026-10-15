import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          🛒 Fresh Grocery
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              {user.isAdmin && <Link to="/admin">Admin</Link>}
              <Link to="/orders">My Orders</Link>
              <span className="muted">Hi, {user.name}</span>
              <button className="link-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/cart" className="cart-link">
            Cart ({count})
          </Link>
        </nav>
      </div>
    </header>
  );
}
