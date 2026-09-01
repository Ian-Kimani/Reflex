import { useState, useEffect } from 'react'
import { Users, CheckCircle, Package } from 'lucide-react'
import { api, type DeliveryRequest, type User } from './api'
import { useToast } from './ToastContext'
import AnimatedLoader from './AnimatedLoader'
export default function DispatcherView() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [riders, setRiders] = useState<User[]>([])
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    try {
      const [reqRes, usersRes] = await Promise.all([
        api.get('/delivery-requests'),
        api.get('/users') // Ensure we fetch users to populate riders dropdown
      ])
      const newRequests = reqRes.data;
      setRequests(prev => JSON.stringify(prev) === JSON.stringify(newRequests) ? prev : newRequests);
      
      const newRiders = usersRes.data.filter((u: User) => u.role === 'rider');
      setRiders(prev => JSON.stringify(prev) === JSON.stringify(newRiders) ? prev : newRiders);
    } catch (error: any) {
      console.error('API Error:', error)
      showToast('Failed to fetch dispatcher data', 'error')
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAssign = async (id: string, riderId: string) => {
    try {
      setLoading(true)
      await api.patch(`/delivery-requests/${id}`, { status: 'assigned', assigned_rider_id: riderId })
      fetchData()
    } catch (error: any) {
      console.error('API Error:', error)
      showToast('Failed to assign rider', 'error')
    }finally {
      setLoading(false)
    }
  }

  const getRiderName = (id?: string) => riders.find(r => r.id === id)?.name || id || 'Unknown'

  const Column = ({ title, status, icon: Icon }: { title: string, status: DeliveryRequest['status'], icon: any }) => (
    <div className="kanban-column">
      <h3>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon size={18} /> {title}
        </span>
        <span className="count">{requests.filter(r => r.status === status).length}</span>
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.filter(r => r.status === status).map(req => (
          <div key={req.id} className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{req.request_number}</strong>
            </div>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>{req.address}</p>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', opacity: 0.7 }}>{req.item_description}</p>
            
            {status === 'open' ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="form-control" style={{ padding: '0.5rem' }} id={`rider-${req.id}`}>
                  <option value="">Rider...</option>
                  {riders.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button 
                  className="btn" style={{ padding: '0.5rem 1rem' }}
                  onClick={() => {
                    const select = document.getElementById(`rider-${req.id}`) as HTMLSelectElement
                    if (select.value) handleAssign(req.id, select.value)
                  }}
                >
                  Go
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                <Users size={14} /> {getRiderName(req.assigned_rider_id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
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
  )
}
  return (
    <div className="animate-in">
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={24} />
          <span className="label">Active Riders</span>
          <span className="value">{riders.length}</span>
        </div>
        <div className="stat-card">
          <Package size={24} />
          <span className="label">Open Requests</span>
          <span className="value">{requests.filter(r => r.status === 'open').length}</span>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <span className="label">Delivered Today</span>
          <span className="value">{requests.filter(r => r.status === 'delivered').length}</span>
        </div>
      </div>

      <div className="kanban-board">
        <Column title="Open" status="open" icon={Package} />
        <Column title="Assigned" status="assigned" icon={Users} />
        <Column title="Picked Up" status="picked_up" icon={Package} />
        <Column title="Delivered" status="delivered" icon={CheckCircle} />
      </div>
    </div>
  )
}
