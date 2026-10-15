import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h2>My orders</h2>
      {location.state?.placed && (
        <p className="success">Your order has been placed! Please pay with Cash on Delivery.</p>
      )}
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="muted">No orders yet. <Link to="/">Start shopping</Link></p>
      )}

      <div className="list">
        {orders.map((o) => (
          <div className="panel" key={o._id}>
            <div className="order-head">
              <div>
                <div className="card-title">Order #{o._id.slice(-6).toUpperCase()}</div>
                <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            {o.items.map((i) => (
              <div className="sum-row" key={i.product}>
                <span>{i.name} x {i.qty} {i.unit}</span>
                <span>Rs. {i.price * i.qty}</span>
              </div>
            ))}
            <div className="sum-row"><span>Delivery</span><span>{o.deliveryPrice === 0 ? 'Free' : `Rs. ${o.deliveryPrice}`}</span></div>
            <div className="sum-row total"><span>Total</span><span>Rs. {o.totalPrice}</span></div>
            <div className="muted">Deliver to: {o.shipping.address}, {o.shipping.city} ({o.shipping.phone})</div>
          </div>
        ))}
      </div>
    </>
  );
}
