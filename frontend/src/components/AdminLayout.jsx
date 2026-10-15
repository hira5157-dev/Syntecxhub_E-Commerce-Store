import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const cls = ({ isActive }) => (isActive ? 'tab active' : 'tab');
  return (
    <>
      <h2>Admin panel</h2>
      <div className="tabs">
        <NavLink end to="/admin" className={cls}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={cls}>Products</NavLink>
        <NavLink to="/admin/orders" className={cls}>Orders</NavLink>
      </div>
      <Outlet />
    </>
  );
}
