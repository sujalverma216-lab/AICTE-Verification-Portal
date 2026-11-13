import { Navigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';

export default function Protected({ role, children }) {
  const { user } = usePortal();
  if (!user || user.role !== role) return <Navigate to="/login" replace />;
  return children;
}
