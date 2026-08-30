import { useState } from 'react'
import { Store, Truck, Bike } from 'lucide-react'
import RetailerView from './RetailerView'
import DispatcherView from './DispatcherView'
import RiderView from './RiderView'
import './index.css'

type Role = 'retailer' | 'dispatcher' | 'rider'

function App() {
  const [role, setRole] = useState<Role>('retailer')

  return (
    <div className="app-container">
      <header className="header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck color="var(--accent-primary)" /> Reflex
        </h1>
        <div className="role-switcher">
          <button 
            className={`btn ${role === 'retailer' ? '' : 'secondary'}`}
            onClick={() => setRole('retailer')}
          >
            <Store size={18} /> Retailer
          </button>
          <button 
            className={`btn ${role === 'dispatcher' ? '' : 'secondary'}`}
            onClick={() => setRole('dispatcher')}
          >
            <Truck size={18} /> Dispatcher
          </button>
          <button 
            className={`btn ${role === 'rider' ? '' : 'secondary'}`}
            onClick={() => setRole('rider')}
          >
            <Bike size={18} /> Rider
          </button>
        </div>
      </header>
      
      <main className="main-content">
        {role === 'retailer' && <RetailerView />}
        {role === 'dispatcher' && <DispatcherView />}
        {role === 'rider' && <RiderView />}
      </main>
    </div>
  )
}

export default App
