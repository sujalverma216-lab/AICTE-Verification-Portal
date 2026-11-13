import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import Loginslider from '../components/Loginslider.jsx';
import '../pages/Login.css';

// Each role opens either the official workspace or the institution workspace.
const ROLES = [
  { label: 'Institution', area: 'institution' },
  { label: 'AICTE official', area: 'official' },
  { label: 'Administrator', area: 'administrator' },
];

export default function Login() {
  const { login } = usePortal();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address.';
    if (!form.password) err.password = 'Enter your password.';
    if (!form.role) err.role = 'Please select a user role.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const r = ROLES.find((x) => x.label === form.role);
    login(r.area, r.label, form.email);
    nav(r.area === 'official' ? '/official' : r.area === 'administrator' ? '/administrator' : '/institution');
  };

  return (
    <section className="login-page">
      <div className="login-left">
        <form className="login-form" onSubmit={submit} noValidate>
          <h1>Sign in</h1>
          <p className="login-intro">Use your registered email and select the role assigned to you.</p>

          <label className="field">Email
            <input type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="name@institution.edu.in" aria-invalid={!!errors.email} />
            {errors.email && <span className="err">{errors.email}</span>}
          </label>

          <label className="field">Password
            <span className="pw">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={set('password')} placeholder="Enter your password" aria-invalid={!!errors.password} />
              <button type="button" className="pw-toggle" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
            </span>
            {errors.password && <span className="err">{errors.password}</span>}
          </label>

          <label className="field">User role
            <select value={form.role} onChange={set('role')} aria-invalid={!!errors.role}>
              <option value="">Please Select User Role</option>
              {ROLES.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>
            {errors.role && <span className="err">{errors.role}</span>}
          </label>

          <button type="submit" className="btn-login">Login</button>
          <p className="login-note">Demo build: any valid-looking email and password will work.</p>
        </form>
      </div>

      <div className="login-right">
        <Loginslider />
      </div>
    </section>
  );
}
