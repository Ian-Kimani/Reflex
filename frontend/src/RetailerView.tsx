import { useState, useEffect, useRef } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import { api, type DeliveryRequest, type User } from './api'
import { useToast } from './ToastContext'
type Customer = { id: string; name: string; phone: string; address: string }
export default function RetailerView({ currentUser }: { currentUser: User }) {
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [formData, setFormData] = useState({ customer_name: '', phone: '', address: '', item_description: '' })
  const { showToast } = useToast();
  const [matches, setMatches] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewCustomerNotice, setShowNewCustomerNotice] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
const isValidPhone = (phone: string) => /^(01|07)\d{8}$/.test(phone)
  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/delivery-requests')
      setRequests(data.reverse())
    } catch (error: any) {
      console.error('API Error:', error)
      showToast('Failed to fetch delivery requests', 'error')
    }
  }

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, customer_name: value })
    setSelectedCustomer(null)
    setShowNewCustomerNotice(false)

    clearTimeout(debounceRef.current)
    if (value.length < 2) { setMatches([]); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/customers/search?q=${encodeURIComponent(value)}`)
        setMatches(data)
        setShowNewCustomerNotice(data.length === 0)
      } catch (e) {
        console.error('Customer search failed', e)
      }
    }, 350)
  }

    const pickCustomer = (c: Customer) => {
    setSelectedCustomer(c)
    setFormData({ ...formData, customer_name: c.name, phone: c.phone, address: c.address })
    setMatches([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      if (!isValidPhone(formData.phone)) {
    showToast('Phone must start with 01 or 07, followed by 8 digits')
    return
  }
    try {
      await api.post('/delivery-requests', {
        id: Date.now().toString().slice(-10),
        request_number: `REQ-${Date.now().toString().slice(-4)}`,
        customer_id: selectedCustomer?.id, // backend find-or-creates if this is omitted, see note below
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        item_description: formData.item_description,
        status: 'open',
        created_by: currentUser.id,
      })
      setFormData({ customer_name: '', phone: '', address: '', item_description: '' })
      setSelectedCustomer(null)
      fetchRequests()
    } catch (e) {
      console.error('API Error:', e)
    }
  }


  return (
    <div className="animate-in split-layout">
      <div className="glass-card delay-1">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle color="var(--accent-primary)" /> New Request
        </h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Customer Name</label>
            <input
              className="form-control"
              value={formData.customer_name}
              onChange={e => handleNameChange(e.target.value)}
              required
              autoComplete="off"
            />
            {matches.length > 0 && (
              <div className="glass-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, padding: '0.5rem', marginTop: '0.25rem' }}>
                {matches.map(c => (
                  <div
                    key={c.id}
                    onClick={() => pickCustomer(c)}
                    style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: '8px' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <strong>{c.name}</strong>
                    <span style={{ opacity: 0.6, marginLeft: '0.5rem', fontSize: '0.85rem' }}>{c.phone}</span>
                  </div>
                ))}
              </div>
            )}
            {showNewCustomerNotice && (
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', margin: '0.4rem 0 0 0' }}>
                No match found — this will be saved as a new customer.
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
  className="form-control"
  value={formData.phone}
  onChange={e => setFormData({ ...formData, phone: e.target.value })}
  required
  pattern="^(01|07)[0-9]{8}$"
  placeholder="e.g. 0712345678"
  disabled={!!selectedCustomer}
/>
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
