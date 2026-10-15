import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { calcDelivery } from '../utils/pricing.js';

export default function Checkout() {
  const { user } = useAuth();
  const { items, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.name || '', phone: '', address: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const delivery = calcDelivery(itemsPrice);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (items.length === 0) {
    return (
      <div className="center-text">
        <h2>Your cart is empty</h2>
        <Link to="/">Browse products</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i.product._id, qty: i.qty })),
        shipping: form,
      });
      clearCart();
      navigate('/orders', { state: { placed: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2>Checkout</h2>
      <div className="two-col">
        <form className="panel" onSubmit={handleSubmit}>
          <h3>Delivery details</h3>
          {error && <p className="error">{error}</p>}
          <label>Full name</label>
          <input className="input" name="fullName" value={form.fullName} onChange={change} required />
          <label>Phone number</label>
          <input className="input" name="phone" placeholder="03XX XXXXXXX" value={form.phone} onChange={change} required />
          <label>Delivery address</label>
          <input className="input" name="address" placeholder="House, street, area" value={form.address} onChange={change} required />
          <label>City</label>
          <input className="input" name="city" value={form.city} onChange={change} required />
          <label>Payment method</label>
          <div className="pay-option">
            <input type="radio" checked readOnly /> Cash on Delivery
          </div>
          <button className="btn" disabled={busy}>
            {busy ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <div className="summary">
          <h3>Order summary</h3>
          {items.map(({ product, qty }) => (
            <div className="sum-row" key={product._id}>
              <span>{product.name} x {qty}</span>
              <span>Rs. {product.price * qty}</span>
            </div>
          ))}
          <div className="sum-row"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span></div>
          <div className="sum-row total"><span>Total</span><span>Rs. {itemsPrice + delivery}</span></div>
        </div>
      </div>
    </>
  );
}
