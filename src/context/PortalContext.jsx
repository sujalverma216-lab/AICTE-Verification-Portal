import { createContext, useContext, useState } from 'react';

export const CHECKLISTS = {
  'Extension of Approval (EoA)': ['Land ownership record', 'Fire safety NOC', 'Building stability certificate', 'Previous approval letter', 'Society or trust registration'],
  'Increase in Intake': ['Previous approval letter', 'Faculty list', 'Laboratory and infrastructure evidence', 'Building stability certificate'],
  'Change of Name or Location': ['Society or trust registration', 'Land ownership record', 'Fire safety NOC', 'Previous approval letter'],
};
const TODAY = '2026-10-28';
const now = () => new Date().toLocaleString('en-IN');

const seed = [
  {
    id: 'EOA-2027-00418', institution: 'Sunrise Institute of Technology', category: 'Extension of Approval (EoA)',
    details: { contact: 'Dr. A. Rao', email: 'registrar@sunrise.example', session: '2027-28' },
    docs: [
      { type: 'Land ownership record', file: 'land_record.pdf', validUntil: '' },
      { type: 'Fire safety NOC', file: 'fire_noc.pdf', validUntil: '2026-08-31' },
      { type: 'Building stability certificate', file: 'building_cert.pdf', validUntil: '2030-04-09' },
      { type: 'Previous approval letter', file: 'approval.pdf', validUntil: '2027-06-30' },
    ],
    status: 'Human review required', findings: [], notes: [], audit: [{ t: '27/10/2026', who: 'System', msg: 'Application submitted' }],
  },
  {
    id: 'EOA-2027-00395', institution: 'Lakeview College of Engineering', category: 'Extension of Approval (EoA)',
    details: { contact: 'Prof. S. Nair', email: 'office@lakeview.example', session: '2027-28' },
    docs: ['Land ownership record', 'Fire safety NOC', 'Building stability certificate', 'Previous approval letter', 'Society or trust registration'].map((t) => ({ type: t, file: t.toLowerCase().replace(/\W+/g, '_') + '.pdf', validUntil: '2029-03-31' })),
    status: 'Human review required', findings: [], notes: [], audit: [{ t: '26/10/2026', who: 'System', msg: 'Application submitted' }],
  },
];

export function validate(app, checklists = CHECKLISTS) {
  const f = [];
  let n = 0;
  const add = (sev, title, why, evidence) => f.push({ id: ++n, sev, title, why, evidence });
  (checklists[app.category] || []).forEach((t) => {
    const d = app.docs.find((x) => x.type === t);
    if (!d || !d.file) add('High', `Missing document: ${t}`, 'Required by the applicable checklist but not received.', `Checklist: ${app.category}`);
    else if (d.validUntil && d.validUntil < TODAY) add('High', `${t} has expired`, `Valid until ${d.validUntil}, which is before ${TODAY}.`, `${d.file}, page 1, Valid until`);
  });
  if (!app.details.contact) add('Medium', 'Contact person missing', 'Application details are incomplete.', 'Application form');
  app.docs.forEach((d) => d.file && add('Info', `Source check pending: ${d.type}`, 'No authorized source is connected in this prototype. Route for manual confirmation. This is not a compliance failure.', d.file));
  return f;
}
seed.forEach((a) => (a.findings = validate(a)));

const Ctx = createContext(null);
export const usePortal = () => useContext(Ctx);

export function PortalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState(seed);
  const [users, setUsers] = useState([
    { id: 1, name: 'Demo Institution User', email: 'institution@example.com', role: 'Institution', active: true },
    { id: 2, name: 'Demo AICTE Official', email: 'official@example.com', role: 'AICTE official', active: true },
    { id: 3, name: 'Portal Administrator', email: 'admin@example.com', role: 'Administrator', active: true },
  ]);
  const [checklists, setChecklists] = useState(() => Object.fromEntries(Object.entries(CHECKLISTS).map(([k, v]) => [k, [...v]])));
  const [checklistVersion, setChecklistVersion] = useState(1);
  const [sysLog, setSysLog] = useState([]);
  const logSystem = (msg) => setSysLog((p) => [{ t: now(), who: user?.label || 'Administrator', msg }, ...p]);

  const login = (role) => setUser({
    role,
    label: role === 'official' ? 'AICTE Official' : role === 'administrator' ? 'Administrator' : 'Institution User',
  });
  const logout = () => setUser(null);
  const getApp = (id) => apps.find((a) => a.id === id);
  const update = (id, fn) => setApps((p) => p.map((a) => (a.id === id ? fn(a) : a)));

  const createApp = (category, institution) => {
    const id = `EOA-2027-${String(500 + apps.length).padStart(5, '0')}`;
    setApps((p) => [{ id, institution, category, details: { contact: '', email: '', session: '2027-28' }, docs: [], status: 'Draft', findings: [], notes: [], audit: [{ t: now(), who: 'Institution', msg: 'Draft created' }] }, ...p]);
    return id;
  };
  const saveDraft = (id, details, docs) => update(id, (a) => ({ ...a, details, docs }));
  const submitApp = (id) => update(id, (a) => ({
    ...a, status: 'Human review required', findings: validate(a, checklists),
    audit: [{ t: now(), who: 'Institution', msg: a.status === 'Evidence requested' ? 'Additional evidence submitted' : 'Application submitted' }, { t: now(), who: 'System', msg: 'Automated validation completed' }, ...a.audit],
  }));
  const recordAction = (id, action, note) => {
    const map = { request: ['Evidence requested', 'Evidence requested from institution'], manual: ['Referred for manual verification', 'Referred for manual verification or inspection'], review: ['Review recorded', 'Review action recorded'] };
    update(id, (a) => ({ ...a, status: map[action][0], notes: [{ t: now(), action: map[action][1], note }, ...a.notes], audit: [{ t: now(), who: 'AICTE Official', msg: `${map[action][1]}${note ? ': ' + note : ''}` }, ...a.audit] }));
  };

  const addUser = (newUser) => {
    const entry = { ...newUser, id: Date.now(), active: true };
    setUsers((p) => [...p, entry]);
    logSystem(`Added ${newUser.role} user ${newUser.email}`);
  };
  const toggleUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    setUsers((p) => p.map((u) => u.id === id ? { ...u, active: !u.active } : u));
    logSystem(`${target.active ? 'Deactivated' : 'Activated'} user ${target.email}`);
  };
  const setChecklist = (category, items) => {
    setChecklists((p) => ({ ...p, [category]: items }));
    setChecklistVersion((v) => v + 1);
    logSystem(`Updated checklist: ${category}`);
  };

  return <Ctx.Provider value={{ user, login, logout, apps, getApp, createApp, saveDraft, submitApp, recordAction, users, addUser, toggleUser, checklists, checklistVersion, setChecklist, sysLog }}>{children}</Ctx.Provider>;
}
