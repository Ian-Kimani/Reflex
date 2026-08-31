import { useState } from 'react';
import { api } from './api';
import { Truck } from 'lucide-react';

export default function LoginView({ onLogin }: { onLogin: (data: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem', margin: 0 }}>
          <Truck color="var(--accent-primary)" size={40} /> Reflex
        </h1>
        <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>Next-Generation Logistics Platform</p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem 0' }}>Sign In</h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
          <p style={{ margin: '0.5rem 0' }}><strong>Demo Accounts:</strong></p>
          <p style={{ margin: 0 }}>admin@example.com / pass123</p>
          <p style={{ margin: 0 }}>retailer@example.com / pass123</p>
          <p style={{ margin: 0 }}>dispatcher@example.com / pass123</p>
          <p style={{ margin: 0 }}>rider1@example.com / pass123</p>
        </div>
      </div>
    </div>
  );
}
