import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <label>Email</label>
      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Password</label>
      <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" disabled={busy}>
        {busy ? 'Please wait...' : 'Login'}
      </button>
      <p className="muted">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
