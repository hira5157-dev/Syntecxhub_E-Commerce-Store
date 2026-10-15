import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <label>Name</label>
      <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      <label>Email</label>
      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Password (at least 6 characters)</label>
      <input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" disabled={busy}>
        {busy ? 'Please wait...' : 'Create account'}
      </button>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
