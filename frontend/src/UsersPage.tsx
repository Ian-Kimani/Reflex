import { useState, useEffect, useCallback } from 'react'
import { PlusCircle, Pencil, Trash2, X } from 'lucide-react'
import { api, type User, type UserRole } from './api'

const ROLES: { value: UserRole, label: string }[] = [
  { value: 'system_admin', label: 'System Admin' },
  { value: 'dispatcher', label: 'Dispatcher' },
  { value: 'retailer_staff', label: 'Retailer Staff' },
  { value: 'rider', label: 'Rider' },
]

const EMPTY_FORM = { name: '', email: '', password_hash: '', role: 'rider' as UserRole }

export default function UsersPage({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (e: any) {
      console.error('API Error:', e)
      setError(e.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const openAddForm = () => {
    setEditingUser(null)
    setFormData(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (u: User) => {
    setEditingUser(u)
    setFormData({ name: u.name, email: u.email, password_hash: '', role: u.role as UserRole })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData(EMPTY_FORM)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingUser) {
        // PATCH /users/:id — only send a password_hash when a new one was entered
        const payload: Record<string, unknown> = { name: formData.name, email: formData.email, role: formData.role }
        if (formData.password_hash) payload.password_hash = formData.password_hash
        await api.patch(`/users/${editingUser.id}`, payload)
      } else {
        // POST /users — body matches Prisma usersCreateInput
        await api.post('/users', {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password_hash: formData.password_hash,
          role: formData.role,
          points: 0
        })
      }
      closeForm()
      await fetchUsers()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save the user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return
    setError('')
    try {
      await api.delete(`/users/${u.id}`)
      await fetchUsers()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete the user.')
    }
  }

  if (loading) return <p style={{ opacity: 0.6 }}>Loading users...</p>

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>User Management</h2>
        {!showForm && (
          <button className="btn" onClick={openAddForm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={16} /> Add User
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}

      {/* Create / Edit form — mirrors the RetailerView "New Request" card */}
      {showForm && (
        <div className="glass-card delay-1" style={{ marginBottom: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle color="var(--accent-primary)" /> {editingUser ? 'Edit User' : 'New User'}
          </h2>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 1.5rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Jane Rider" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="jane@reflex.co" />
              </div>
              <div className="form-group">
                <label>password</label>
                <input type="password_hash" className="form-control" value={formData.password_hash} onChange={e => setFormData({ ...formData, password_hash: e.target.value })} required={!editingUser} placeholder={editingUser ? 'Leave blank to keep current' : 'Set an initial password'} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn" disabled={saving} style={{ padding: '0.75rem 1.5rem' }}>
                {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
              </button>
              <button type="button" className="btn secondary" onClick={closeForm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users list */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '0.75rem' }}>Name</th>
            <th style={{ padding: '0.75rem' }}>Email</th>
            <th style={{ padding: '0.75rem' }}>Role</th>
            <th style={{ padding: '0.75rem' }}>Points</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const isSelf = u.id === currentUser.id
            return (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem' }}>
                  {u.name}
                  {isSelf && <span style={{ opacity: 0.5, marginLeft: '0.5rem', fontSize: '0.85rem' }}>(you)</span>}
                </td>
                <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge role-${u.role}`}>{u.role.replace('_', ' ')}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{u.points}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="btn secondary" onClick={() => openEditForm(u)} style={{ padding: '0.4rem 0.9rem', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => handleDelete(u)}
                    disabled={isSelf}
                    title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                    style={{ padding: '0.4rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isSelf ? undefined : '#ef4444' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {users.length === 0 && <p style={{ opacity: 0.5, marginTop: '1rem' }}>No users found.</p>}
    </div>
  )
}