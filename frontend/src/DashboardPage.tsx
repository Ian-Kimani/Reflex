import { BarChart3, Package, CheckCircle, Clock, Users, Award, TrendingUp } from 'lucide-react';
import { useDeliveryData } from './useDeliveryData';
import type { User } from './api';
import StatusChart from './StatusChart';
import AnimatedLoader from './AnimatedLoader';

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <Icon size={24} />
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}

export default function DashboardPage({ currentUser }: { currentUser: User }) {
  const { requests, users, loading } = useDeliveryData();
 if (loading) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      
    }}>
      <AnimatedLoader />
    </div>
  );
}
  const byStatus = (s: string) => requests.filter(r => r.status === s).length;
  const rate = (subset: typeof requests) =>
    subset.length
      ? `${Math.round((subset.filter(r => r.status === 'delivered').length / subset.length) * 100)}%`
      : '—';
const statusChartData = ['open', 'assigned', 'picked_up', 'delivered'].map(status => ({
  status,
  count: byStatus(status),
}));
  if (currentUser.role === 'system_admin') {
    return (
      <div className="animate-in">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 /> System Overview
        </h2>
        <StatusChart data={statusChartData} />
        <div className="stats-grid">
          <StatCard icon={Package} label="Total Requests" value={requests.length} />
          <StatCard icon={Clock} label="Open" value={byStatus('open')} />
          <StatCard icon={Users} label="In Transit" value={byStatus('assigned') + byStatus('picked_up')} />
          <StatCard icon={CheckCircle} label="Delivered" value={byStatus('delivered')} />
        </div>
        <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
          <StatCard icon={Users} label="Active Riders" value={users.filter(u => u.role === 'rider').length} />
          <StatCard icon={Users} label="Dispatchers" value={users.filter(u => u.role === 'dispatcher').length} />
          <StatCard icon={Users} label="Retailers" value={users.filter(u => u.role === 'retailer_staff').length} />
          <StatCard icon={TrendingUp} label="Fulfillment Rate" value={rate(requests)} />
        </div>
      </div>
    );
  }

  if (currentUser.role === 'dispatcher') {
    return (
      <div className="animate-in">
        <h2>Dispatcher Performance</h2>
        <StatusChart data={statusChartData} />
        <div className="stats-grid">
          <StatCard icon={Package} label="Unassigned" value={byStatus('open')} />
          <StatCard icon={Users} label="Active Riders" value={users.filter(u => u.role === 'rider').length} />
          <StatCard icon={Clock} label="In Progress" value={byStatus('assigned') + byStatus('picked_up')} />
          <StatCard icon={TrendingUp} label="Fulfillment Rate" value={rate(requests)} />
        </div>
      </div>
    );
  }

  if (currentUser.role === 'retailer_staff') {
    const mine = requests.filter(r => r.created_by === currentUser.id);
    return (
      <div className="animate-in">
        <h2>Your Performance</h2>
        <div className="stats-grid">
          <StatCard icon={Package} label="Requests Created" value={mine.length} />
          <StatCard icon={Clock} label="Pending" value={mine.filter(r => r.status !== 'delivered').length} />
          <StatCard icon={CheckCircle} label="Delivered" value={mine.filter(r => r.status === 'delivered').length} />
          <StatCard icon={TrendingUp} label="Fulfillment Rate" value={rate(mine)} />
        </div>
      </div>
    );
  }

  // rider
  const mine = requests.filter(r => r.assigned_rider_id === currentUser.id);
  return (
    <div className="animate-in">
      <h2>Your Performance</h2>
      <div className="stats-grid">
        <StatCard icon={Award} label="Points" value={currentUser.points} />
        <StatCard icon={Package} label="Active" value={mine.filter(r => r.status !== 'delivered').length} />
        <StatCard icon={CheckCircle} label="Completed" value={mine.filter(r => r.status === 'delivered').length} />
      </div>
    </div>
  );
}
