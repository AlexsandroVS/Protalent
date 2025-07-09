import { AdminAuthProvider } from '../../context/admin/AdminAuthContext';

export default function AdminLoginLayout({ children }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
