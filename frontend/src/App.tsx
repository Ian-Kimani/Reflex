import { useState, useEffect } from 'react'
import { Truck, LogOut, Store, Bike } from 'lucide-react'
import RetailerView from './RetailerView'
import DispatcherView from './DispatcherView'
import RiderView from './RiderView'
import LoginView from './LoginView'
import type { User } from './api'
import './index.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [adminView, setAdminView] = useState<'retailer' | 'dispatcher' | 'rider'>('dispatcher')

  useEffect(() => {
    const storedUser = localStorage.getItem('reflex_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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

  const isAdmin = user.role === 'system_admin' || user.role === 'admin';
  const currentView = isAdmin ? adminView : user.role;

  return (
    <div className="app-container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Truck color="var(--accent-primary)" /> Reflex
        </h1>

        {isAdmin && (
          <div className="role-switcher">
            <button 
              className={`btn ${adminView === 'retailer' ? '' : 'secondary'}`}
              onClick={() => setAdminView('retailer')}
            >
              <Store size={18} /> Retailer
            </button>
            <button 
              className={`btn ${adminView === 'dispatcher' ? '' : 'secondary'}`}
              onClick={() => setAdminView('dispatcher')}
            >
              <Truck size={18} /> Dispatcher
            </button>
            <button 
              className={`btn ${adminView === 'rider' ? '' : 'secondary'}`}
              onClick={() => setAdminView('rider')}
            >
              <Bike size={18} /> Rider
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Logged in as <strong>{user.name}</strong> ({user.role})
          </span>
          <button className="btn secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>
      
      <main className="main-content">
        {currentView === 'retailer' && <RetailerView />}
        {currentView === 'dispatcher' && <DispatcherView />}
        {currentView === 'rider' && <RiderView userId={isAdmin ? 'rider-1' : user.id} />}
      </main>
    </div>
  )
}

export default App
