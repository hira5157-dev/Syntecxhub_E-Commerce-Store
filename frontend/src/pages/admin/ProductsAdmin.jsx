import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Snacks'];
const UNITS = ['kg', 'dozen', 'litre', 'piece', 'bunch'];
const EMPTY = { name: '', category: 'Fruits', unit: 'kg', price: '', stock: '', image: '', description: '' };

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = () =>
    api
      .get('/products', { params: { limit: 50 } })
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Failed to load products'));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
    setError('');
    setMsg('');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      unit: p.unit,
      price: p.price,
      stock: p.stock,
      image: p.image || '',
      description: p.description || '',
    });
    setEditId(p._id);
    setShowForm(true);
    setError('');
    setMsg('');
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) await api.put(`/products/${editId}`, body);
      else await api.post('/products', body);
      setShowForm(false);
      setMsg(editId ? 'Product updated' : 'Product added');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" Delete this product?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      setMsg('Product deleted');
      load();
    } catch {
      setError('Could not delete product');
    }
  };

  return (
    <>
      <div className="order-head">
        <h3>Products ({products.length})</h3>
        <button className="btn" onClick={openAdd}>+ Add product</button>
      </div>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="panel" onSubmit={save}>
          <h3>{editId ? 'Edit product' : 'Add product'}</h3>
          <label>Name</label>
          <input className="input" name="name" value={form.name} onChange={change} required />
          <div className="form-row">
            <div>
              <label>Category</label>
              <select className="input" name="category" value={form.category} onChange={change}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Unit</label>
              <select className="input" name="unit" value={form.unit} onChange={change}>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label>Price (Rs.)</label>
              <input className="input" type="number" min="0" name="price" value={form.price} onChange={change} required />
            </div>
            <div>
              <label>Stock</label>
              <input className="input" type="number" min="0" name="stock" value={form.stock} onChange={change} required />
            </div>
          </div>
          <label>Image URL (optional)</label>
          <input className="input" name="image" placeholder="https://... or /images/products/mango.jpg" value={form.image} onChange={change} />
          {form.image && <img className="img-preview" src={form.image} alt="preview" onError={(e) => (e.target.style.display = 'none')} onLoad={(e) => (e.target.style.display = 'block')} />}
          <label>Description (optional)</label>
          <input className="input" name="description" value={form.description} onChange={change} />
          <div className="form-actions">
            <button className="btn">{editId ? 'Update' : 'Save'}</button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>Rs. {p.price} / {p.unit}</td>
                <td className={p.stock < 10 ? 'low' : ''}>{p.stock}</td>
                <td>
                  <button className="link-btn" onClick={() => openEdit(p)}>Edit</button>{' '}
                  <button className="link-btn danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
