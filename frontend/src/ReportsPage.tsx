import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { useDeliveryData } from './useDeliveryData';

export default function ReportsPage() {
  const { requests, users, loading } = useDeliveryData();
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) return <p style={{ opacity: 0.6 }}>Loading reports...</p>;

  const filtered = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);
  const getRiderName = (id?: string) => users.find(u => u.id === id)?.name || '—';

  const exportCsv = () => {
    const headers = ['Request #', 'Customer', 'Address', 'Item', 'Status', 'Rider'];
    const rows = filtered.map(r => [
      r.request_number,
      r.customer_name,
      r.address,
      r.item_description,
      r.status,
      getRiderName(r.assigned_rider_id),
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reflex-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Reports</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Filter size={16} />
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="picked_up">Picked up</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className="btn secondary" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '0.75rem' }}>Request #</th>
            <th style={{ padding: '0.75rem' }}>Customer</th>
            <th style={{ padding: '0.75rem' }}>Status</th>
            <th style={{ padding: '0.75rem' }}>Rider</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.75rem' }}>{r.request_number}</td>
              <td style={{ padding: '0.75rem' }}>{r.customer_name}</td>
              <td style={{ padding: '0.75rem' }}>
                <span className={`badge ${r.status}`}>{r.status.replace('_', ' ')}</span>
              </td>
              <td style={{ padding: '0.75rem' }}>{getRiderName(r.assigned_rider_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p style={{ opacity: 0.5, marginTop: '1rem' }}>No matching requests.</p>}
    </div>
  );
}
