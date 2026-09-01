import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  open: '#f59e0b',
  assigned: '#3b82f6',
  picked_up: '#8b5cf6',
  delivered: '#10b981',
}

export default function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Requests by Status</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="status" stroke="var(--text-secondary)" fontSize={12} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.status} fill={STATUS_COLORS[d.status] || 'var(--accent-primary)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}