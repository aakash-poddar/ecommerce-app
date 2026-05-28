import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import ToastList from '../components/Toast'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).slice(2, 9)
    const toast = {
      id,
      message: typeof message === 'string' ? message : message?.text || '',
      type: options.type || (message?.type || 'info'),
      duration: options.duration || 3500,
    }
    setToasts((s) => [toast, ...s])
    if (toast.duration > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id))
      }, toast.duration)
    }
    return id
  }, [])

  const hide = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), [])

  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastList toasts={toasts} onClose={hide} />
    </ToastContext.Provider>
  )
}

export default ToastContext
