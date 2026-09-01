import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Toast = { id: number; message: string; type: 'error' | 'success' }

const ToastContext = createContext<{ showToast: (message: string, type?: Toast['type']) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'error') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="glass-card"
            style={{
              padding: '0.9rem 1.25rem',
              borderColor: t.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)',
              background: t.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
              minWidth: '240px',
              fontSize: '0.9rem',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}