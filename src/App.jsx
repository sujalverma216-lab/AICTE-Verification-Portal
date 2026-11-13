import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Protected from './components/Protected.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import OfficialDashboard from './pages/OfficialDashboard.jsx';
import ReviewWorkspace from './pages/ReviewWorkspace.jsx';
import InstitutionDashboard from './pages/InstitutionDashboard.jsx';
import SelectCategory from './pages/SelectCategory.jsx';
import ApplicationForm from './pages/ApplicationForm.jsx';
import ReviewApplication from './pages/ReviewApplication.jsx';
import ValidationStatus from './pages/ValidationStatus.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/official" element={<Protected role="official"><OfficialDashboard /></Protected>} />
        <Route path="/administrator" element={<Protected role="administrator"><AdminDashboard /></Protected>} />
        <Route path="/official/review/:id" element={<Protected role="official"><ReviewWorkspace /></Protected>} />
        <Route path="/institution" element={<Protected role="institution"><InstitutionDashboard /></Protected>} />
        <Route path="/institution/new" element={<Protected role="institution"><SelectCategory /></Protected>} />
        <Route path="/institution/apply/:id" element={<Protected role="institution"><ApplicationForm /></Protected>} />
        <Route path="/institution/review/:id" element={<Protected role="institution"><ReviewApplication /></Protected>} />
        <Route path="/institution/status/:id" element={<Protected role="institution"><ValidationStatus /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
