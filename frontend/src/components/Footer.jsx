import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand light">🛒 Fresh Grocery</div>
          <p className="footer-text">Fresh fruits, vegetables and everyday essentials, delivered straight to your door.</p>
        </div>
        <div>
          <div className="footer-title">Quick links</div>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div>
          <div className="footer-title">Our policy</div>
          <span>Cash on Delivery</span>
          <span>Free delivery on orders above Rs. 2000</span>
          <span>Freshness guaranteed</span>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Fresh Grocery. All rights reserved.</div>
    </footer>
  );
}
