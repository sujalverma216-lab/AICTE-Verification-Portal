const TONE = {
  Draft: 'neutral',
  'Under validation': 'info',
  'Human review required': 'warn',
  'Evidence requested': 'warn',
  'Referred for manual verification': 'warn',
  'Review recorded': 'ok',
};
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${TONE[status] || 'neutral'}`}>{status}</span>;
}
