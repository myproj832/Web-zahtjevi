
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AdminProvider } from '../context/AdminContext.jsx';

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, rola } = useAuth();
  return (isAuthenticated && rola === 'Admin')
    ? children
    : <Navigate to="/" replace />;
};

export const AdminLayout = () => (
  <AdminProvider>
    <RequireAdmin>
      <Outlet />
    </RequireAdmin>
  </AdminProvider>
);
