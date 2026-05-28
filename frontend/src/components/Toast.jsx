import React from 'react'

function ToastItem({ toast, onClose }) {
  return (
    <div className={`toast-item toast-${toast.type || 'info'}`} role="status">
      <div className="toast-message">{toast.message}</div>
      <button aria-label="Close" className="toast-close" onClick={() => onClose(toast.id)}>
        ×
      </button>
    </div>
  )
}

export default function ToastList({ toasts = [], onClose = () => {} }) {
  return (
    <div className="toast-portal" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  )
}
