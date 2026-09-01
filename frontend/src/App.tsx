import { useState, useEffect } from 'react'
import { Truck, LogOut, Store, Bike, LayoutDashboard, ClipboardList, FileBarChart, Users } from 'lucide-react'
import RetailerView from './RetailerView'
import DispatcherView from './DispatcherView'
import RiderView from './RiderView'
import LoginView from './LoginView'
import DashboardPage from './DashboardPage'
import ReportsPage from './ReportsPage'
import UsersPage from './UsersPage'
import { api, type User } from './api'
import './index.css'
import { ToastProvider } from './ToastContext'

type Tab = 'dashboard' | 'operations' | 'reports' | 'users'
type OpsView = 'retailer' | 'dispatcher' | 'rider'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [opsView, setOpsView] = useState<OpsView>('dispatcher')
  const [riders, setRiders] = useState<User[]>([])
  const [selectedRiderId, setSelectedRiderId] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('reflex_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const isAdmin = user?.role === 'system_admin' || user?.role === 'admin'

  // User management is restricted to system admins (matches the backend's
  // @Roles(Role.SystemAdmin) guard on the users controller).
  const canManageUsers = user?.role === 'system_admin'

  // Admin oversight needs a real rider to inspect instead of a hardcoded id.
  useEffect(() => {
    if (!isAdmin) return
    api.get('/users')
      .then(({ data }) => {
        const riderList = data.filter((u: User) => u.role === 'rider')
        setRiders(riderList)
        setSelectedRiderId(prev => prev || riderList[0]?.id || '')
      })
      .catch(e => console.error('API Error:', e))
  }, [isAdmin])

  const handleLogin = (data: { access_token: string, user: User }) => {
    localStorage.setItem('reflex_token', data.access_token)
    localStorage.setItem('reflex_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('reflex_token')
    localStorage.removeItem('reflex_user')
    setUser(null)
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} />
  }

  const currentOpsView = isAdmin ? opsView : (user.role as OpsView)

  return (
    <ToastProvider>
    <div className="app-container">
      <header className="header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Truck color="var(--accent-primary)" /> Reflex
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Logged in as <strong>{user.name}</strong> ({user.role})
            </span>
            <button className="btn secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Primary nav — same tabs for everyone, Reports gated to admin */}
        <nav style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button className={`btn ${tab === 'dashboard' ? '' : 'secondary'}`} onClick={() => setTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`btn ${tab === 'operations' ? '' : 'secondary'}`} onClick={() => setTab('operations')}>
            <ClipboardList size={18} /> Operations
          </button>
          {isAdmin && (
            <button className={`btn ${tab === 'reports' ? '' : 'secondary'}`} onClick={() => setTab('reports')}>
              <FileBarChart size={18} /> Reports
            </button>
          )}
          {canManageUsers && (
            <button className={`btn ${tab === 'users' ? '' : 'secondary'}`} onClick={() => setTab('users')}>
              <Users size={18} /> Users
            </button>
          )}
        </nav>

        {/* Secondary bar — only appears for admin, inside Operations, and is clearly labeled
            as oversight (view a real user's screen) rather than the old fake impersonation. */}
        {isAdmin && tab === 'operations' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Viewing as:</span>
            <div className="role-switcher" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`btn ${opsView === 'retailer' ? '' : 'secondary'}`} onClick={() => setOpsView('retailer')} style={{ padding: '0.4rem 0.9rem' }}>
                <Store size={16} /> Retailer
              </button>
              <button className={`btn ${opsView === 'dispatcher' ? '' : 'secondary'}`} onClick={() => setOpsView('dispatcher')} style={{ padding: '0.4rem 0.9rem' }}>
                <Truck size={16} /> Dispatcher
              </button>
              <button className={`btn ${opsView === 'rider' ? '' : 'secondary'}`} onClick={() => setOpsView('rider')} style={{ padding: '0.4rem 0.9rem' }}>
                <Bike size={16} /> Rider
              </button>
            </div>
            {opsView === 'rider' && (
              <select
                className="form-control"
                style={{ padding: '0.4rem 0.75rem', maxWidth: '220px' }}
                value={selectedRiderId}
                onChange={e => setSelectedRiderId(e.target.value)}
              >
                {riders.length === 0 && <option value="">No riders found</option>}
                {riders.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            )}
          </div>
        )}
      </header>

      <main className="main-content">
        {tab === 'dashboard' && <DashboardPage currentUser={user} />}
        {tab === 'reports' && isAdmin && <ReportsPage />}
        {tab === 'users' && canManageUsers && <UsersPage currentUser={user} />}
        {tab === 'operations' && (
          <>
            {currentOpsView === 'retailer' && <RetailerView currentUser={user} />}
            {currentOpsView === 'dispatcher' && <DispatcherView />}
            {currentOpsView === 'rider' && (
              <RiderView userId={isAdmin ? selectedRiderId : user.id} />
            )}
          </>
        )}
      </main>
    </div>
    </ToastProvider>
  )
}

export default App
