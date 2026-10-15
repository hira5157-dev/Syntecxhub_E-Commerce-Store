import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const STATUSES = ['Pending', 'Shipped', 'Delivered'];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch {
      setError('Could not update status');
    }
  };

  return (
    <>
      <h3>Orders ({orders.length})</h3>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && orders.length === 0 && <p className="muted">No orders yet.</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>
                  #{o._id.slice(-6).toUpperCase()}
                  <div className="muted">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td>
                  {o.shipping.fullName}
                  <div className="muted">{o.user?.email}</div>
                  <div className="muted">{o.shipping.phone}, {o.shipping.address}, {o.shipping.city}</div>
                </td>
                <td>
                  {o.items.map((i) => (
                    <div key={i.product}>{i.name} x {i.qty}</div>
                  ))}
                </td>
                <td>Rs. {o.totalPrice}</td>
                <td>
                  <select
                    className="input status-select"
                    value={o.status}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
