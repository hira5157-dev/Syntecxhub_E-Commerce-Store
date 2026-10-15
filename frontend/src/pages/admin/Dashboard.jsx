import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/products', { params: { limit: 50 } })])
      .then(([o, p]) => {
        setOrders(o.data);
        setProducts(p.data.products);
      })
      .catch(() => setError('Failed to load data'));
  }, []);

  const pending = orders.filter((o) => o.status === 'Pending').length;
  const sales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStock = products.filter((p) => p.stock < 10);

  const stats = [
    ['Total orders', orders.length],
    ['Pending orders', pending],
    ['Products', products.length],
    ['Total sales', `Rs. ${sales}`],
  ];

  return (
    <>
      {error && <p className="error">{error}</p>}
      <div className="stats">
        {stats.map(([label, value]) => (
          <div className="stat" key={label}>
            <div className="muted">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>Recent orders</h3>
          {orders.length === 0 && <p className="muted">No orders yet.</p>}
          {orders.slice(0, 5).map((o) => (
            <div className="sum-row" key={o._id}>
              <span>#{o._id.slice(-6).toUpperCase()} - {o.user?.name}</span>
              <span>Rs. {o.totalPrice} ({o.status})</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Low stock (under 10)</h3>
          {lowStock.length === 0 && <p className="muted">All products are well stocked.</p>}
          {lowStock.map((p) => (
            <div className="sum-row" key={p._id}>
              <span>{p.name}</span>
              <span>{p.stock} left</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
