import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = usePortal();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const home = user ? (user.role === 'official' ? '/official' : user.role === 'administrator' ? '/administrator' : '/institution') : '/';
  return (
    <div className="site">
      <div className="flag-strip" aria-hidden="true" />
      <header className="site-header">
        <Link to={home} className="brand">
          <span className="brand-seal">AICTE</span>
          <span>
            <strong>All India Council for Technical Education</strong>
            <small>Application Verification Portal</small>
          </span>
        </Link>
        {!user && pathname === '/' && <Link to="/login" className="btn btn-light">Sign in</Link>}
        {user && (
          <div className="user-box">
            <span>{user.label}</span>
            <button className="btn btn-light" onClick={() => { logout(); nav('/'); }}>Sign out</button>
          </div>
        )}
      </header>
      <main className={(pathname === '/' || pathname === '/login') ? 'full' : 'container'}>{children}</main>
      <footer className="site-footer">
        Prototype with synthetic data. Automated findings are advisory; final regulatory decisions rest with the competent authority.
      </footer>
    </div>
  );
}
