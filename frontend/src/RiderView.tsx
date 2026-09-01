import { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Package, Award } from 'lucide-react'
import { api, type DeliveryRequest } from './api'
import { useToast } from './ToastContext'
import AnimatedLoader from './AnimatedLoader'

export default function RiderView({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [podRecipients, setPodRecipients] = useState<Record<string, string>>({})
  const [points, setPoints] = useState(0)
  const [riderInfo, setRiderInfo] = useState<{name: string, email: string} | null>(null)
  const [loading, setLoading] = useState(true)
 const { showToast } = useToast()
 const fetchData = async (initialLoad = false) => {
  if (!userId) return;

  try {
    if (initialLoad) {
      setLoading(true)
    }

    const [reqRes, userRes] = await Promise.all([
      api.get('/delivery-requests'),
      api.get(`/users/${userId}`).catch(() => ({ data: { points: 0 } }))
    ])

    const newRequests = reqRes.data.filter(
      (r: DeliveryRequest) => r.assigned_rider_id === userId
    )

    setRequests(prev =>
      JSON.stringify(prev) === JSON.stringify(newRequests)
        ? prev
        : newRequests
    )

    setPoints(prev =>
      prev === userRes.data.points
        ? prev
        : (userRes.data.points || 0)
    )

    setRiderInfo(prev =>
      prev?.name === userRes.data.name
        ? prev
        : {
            name: userRes.data.name || 'Unknown',
            email: userRes.data.email || ''
          }
    )

  } catch (error: any) {
    console.error('API Error:', error)
    showToast('Failed to fetch rider data', 'error')
  } finally {
    if (initialLoad) {
      setLoading(false)
    }
  }
}

  useEffect(() => {
  fetchData(true)

  const interval = setInterval(() => {
    fetchData(false)
  }, 5000)

  return () => clearInterval(interval)
}, [userId])

  const handleUpdateStatus = async (id: string, newStatus: DeliveryRequest['status']) => {
    try {
      await api.patch(`/delivery-requests/${id}`, { status: newStatus })
      fetchData() // Refresh points and status
    } catch (error: any) {
      
      showToast('Failed to update delivery status', 'error')
    }
  }

  const handleProofOfDelivery = (id: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!podRecipients[id]) return
    handleUpdateStatus(id, 'delivered')
    setPodRecipients({...podRecipients, [id]: ''})
  }
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
  return (
    <div className="animate-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Rider Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Welcome back, {riderInfo?.name}</h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>{riderInfo?.email}</p>
        </div>
      </div>

      {/* Rewards Card */}
      <div className="reward-card">
        <Award size={48} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ margin: 0 }}>Rider Rewards</h2>
        <div className="reward-points">{points}</div>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent-secondary)' }}>pts earned! Deliver to earn more.</p>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Active Deliveries</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {requests.filter(r => r.status !== 'delivered').map(req => (
          <div key={req.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{req.request_number}</h3>
              <span className={`badge ${req.status}`}>{req.status.replace('_', ' ')}</span>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="var(--text-secondary)" /> <strong>To:</strong> {req.customer_name || 'N/A'}
              </p>
              <p style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--text-secondary)" /> <strong>Location:</strong> {req.address || 'N/A'}
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="var(--text-secondary)" /> <strong>Item:</strong> {req.item_description}
              </p>
            </div>

            {req.status === 'assigned' && (
              <button className="btn" style={{ width: '100%', padding: '1rem' }} onClick={() => handleUpdateStatus(req.id, 'picked_up')}>
                Mark as Picked Up
              </button>
            )}

            {req.status === 'picked_up' && (
              <form onSubmit={(e) => handleProofOfDelivery(req.id, e)}>
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input 
                    className="form-control" 
                    value={podRecipients[req.id] || ''} 
                    onChange={e => setPodRecipients({...podRecipients, [req.id]: e.target.value})} 
                    required 
                    placeholder="Signature / Name"
                  />
                </div>
                <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--status-delivered), #059669)' }}>
                  Confirm Delivery (+50 pts)
                </button>
              </form>
            )}
          </div>
        ))}
        {requests.filter(r => r.status !== 'delivered').length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>You have no active deliveries.</p>
        )}
      </div>
    </div>
  )
}
