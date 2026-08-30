import { useState, useEffect } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import { api, type DeliveryRequest } from './api'

export default function RetailerView() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [formData, setFormData] = useState({ customer_name: '', phone: '', address: '', item_description: '' })

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/delivery-requests')
      setRequests(data.reverse())
    } catch (e) {
      console.error('API Error:', e)
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/delivery-requests', {
        id: Date.now().toString().slice(-10),
        request_number: `REQ-${Date.now().toString().slice(-4)}`,
        customer_id: 'cust-1', // Mock customer id
        customer_name: formData.customer_name,
        address: formData.address,
        item_description: formData.item_description,
        status: 'open',
        created_by: 'user-1' // Mock creator id
      })
      setFormData({ customer_name: '', phone: '', address: '', item_description: '' })
      fetchRequests()
    } catch (e) {
      console.error('API Error:', e)
    }
  }

  return (
    <div className="animate-in split-layout">
      
      {/* Creation Form */}
      <div className="glass-card delay-1">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle color="var(--accent-primary)" /> New Request
        </h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label>Customer Name</label>
            <input className="form-control" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <input className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Item Description</label>
            <input className="form-control" value={formData.item_description} onChange={e => setFormData({...formData, item_description: e.target.value})} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Dispatch Delivery</button>
        </form>
      </div>

      {/* Requests List */}
      <div className="delay-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>My Active Deliveries</h2>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map(req => (
            <div key={req.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{req.request_number} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '1rem' }}>| {req.item_description}</span></h3>
                <p style={{ margin: 0 }}>To: {req.customer_name || 'N/A'}, {req.address || 'N/A'}</p>
              </div>
              <span className={`badge ${req.status}`}>{req.status.replace('_', ' ')}</span>
            </div>
          ))}
          {requests.length === 0 && <p style={{ opacity: 0.5 }}>No requests yet.</p>}
        </div>
      </div>

    </div>
  )
}
