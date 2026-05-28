import { useShop } from '../context/useShop'
import { Header } from '../components/Header'
import { Shell } from '../components/ShopUI'

export function AuthPageFrame({ title, subtitle, children, sideTitle, sideDescription }) {
  const { cartCount, user, logout } = useShop()
  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack auth-layout">
        <section className="card auth-visual">
          <p className="eyebrow">ShopEase secure access</p>
          <h2>{sideTitle}</h2>
          <p>{sideDescription}</p>
          <div className="auth-illustration">
            <div className="auth-ring auth-ring-one" />
            <div className="auth-ring auth-ring-two" />
            <div className="auth-illustration-card">
              <span className="brand-mark">SE</span>
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </div>
          </div>
        </section>
        <section className="card auth-form-card">{children}</section>
      </main>
    </Shell>
  )
}
