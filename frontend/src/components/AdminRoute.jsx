import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
}
