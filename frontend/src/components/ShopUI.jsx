import { Link } from 'react-router-dom'
import { Footer } from './Footer'

export function Shell({ children }) {
  return (
    <div className="shell">
      {children}
      <Footer />
    </div>
  )
}

export function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="description">{description}</p> : null}
      </div>
      {action ? <div className="page-title-action">{action}</div> : null}
    </div>
  )
}

export function SectionTitle({ title, description, action }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function Button({ children, variant = 'primary', ...props }) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  )
}

export function TextButton({ children, ...props }) {
  return (
    <button type="button" className="text-button" {...props}>
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <section className={`card ${className}`.trim()}>{children}</section>
}

export function MetricCard({ label, value, tone }) {
  return (
    <div className={`metric metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  return (
    <article className={`product-card ${product.featured ? 'featured' : ''}`}>
      {product.featured ? <div className="product-badge">New drop</div> : null}
      <Link to={`/products/${product.id}`} className="product-media" style={{ background: product.accent }}>
        <div className="product-media-inner">
          <img className="product-media-image" src={product.image} alt={product.name} loading="lazy" />
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="pill">{product.category}</span>
          <button
            type="button"
            className={`icon-button ${isWishlisted ? 'active' : ''}`}
            onClick={() => onToggleWishlist?.(product.id)}
            aria-label={`Toggle wishlist for ${product.name}`}
          >
            ♥
          </button>
        </div>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <strong>₹{product.price.toLocaleString('en-IN')}</strong>
          <span>{product.rating} ★</span>
        </div>
        <button type="button" className="btn btn-primary btn-wide" onClick={() => onAddToCart?.(product.id)}>
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export function StatusBadge({ status }) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`status status-${normalizedStatus}`}>{status}</span>
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? action : null}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Input(props) {
  return <input className="input" {...props} />
}

export function Textarea(props) {
  return <textarea className="input textarea" {...props} />
}

export function Select(props) {
  return <select className="input" {...props} />
}
