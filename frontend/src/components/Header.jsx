import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useShop } from '../context/useShop'
import { useTheme } from '../context/useTheme'

function ThemeIcon({ isDark }) {
  return isDark ? (
    <span aria-hidden="true" className="theme-icon">
      ☀
    </span>
  ) : (
    <span aria-hidden="true" className="theme-icon">
      ☾
    </span>
  )
}

export function Header({ cartCount, user, onLogout }) {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/cart', label: 'Cart' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/orders', label: 'Orders' },
    { to: '/admin', label: 'Admin' },
  ]
  const { isDark, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { authSummary } = useShop()
  const visibleNavItems = authSummary.isAdmin ? navItems : navItems.filter((item) => item.to !== '/admin')

  useEffect(() => {
    // lock body scroll when mobile menu is open
    try {
      document.body.classList.toggle('menu-open', mobileOpen)
    } catch (e) {}
  }, [mobileOpen])

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">SE</span>
        <span>
          <strong>ShopEase</strong>
          <small>Modern commerce UI</small>
        </span>
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((s) => !s)}
      >
        ☰
      </button>

      <nav className="nav-links desktop-only" aria-label="Primary navigation">
        {visibleNavItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {mobileOpen ? (
        <div className="mobile-panel" role="dialog" aria-modal="true">
          <div className="mobile-panel-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="mobile-panel-inner">
            <div className="mobile-panel-top">
              <Link to="/" className="brand mobile-brand" onClick={() => setMobileOpen(false)}>
                <span className="brand-mark">SE</span>
                <span>
                  <strong>ShopEase</strong>
                  <small>Modern commerce UI</small>
                </span>
              </Link>
              <button type="button" className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                ×
              </button>
            </div>

            <nav className="mobile-nav" aria-label="Mobile navigation">
              {visibleNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mobile-actions">
              <button
                type="button"
                className="chip theme-chip"
                onClick={() => {
                  toggleTheme()
                  setMobileOpen(false)
                }}
              >
                <ThemeIcon isDark={isDark} />
              </button>

              {!authSummary.isLoggedIn ? (
                <>
                  <Link to="/login" className="chip action-chip" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="chip ghost-chip" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="user-chip mobile-user" onClick={() => setMobileOpen(false)}>
                    <span className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'G'}</span>
                    <div>
                      <strong>{user?.name || 'Guest'}</strong>
                      <small>{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}</small>
                    </div>
                  </div>
                  <button type="button" className="chip ghost-chip" onClick={() => { onLogout(); setMobileOpen(false) }}>
                    Logout
                  </button>
                </>
              )}

              <Link to="/wishlist" className="chip action-chip" onClick={() => setMobileOpen(false)}>
                Wishlist
              </Link>
              <Link to="/cart" className="chip action-chip" onClick={() => setMobileOpen(false)}>
                Cart <span className="badge">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="header-actions">
        <button type="button" className="chip theme-chip" onClick={toggleTheme} aria-label="Toggle theme">
          <ThemeIcon isDark={isDark} />
        </button>
        {!authSummary.isLoggedIn ? (
          <>
            <Link to="/login" className="chip action-chip auth-chip">
              Login
            </Link>
            <Link to="/register" className="chip ghost-chip auth-chip">
              Register
            </Link>
          </>
        ) : null}
        <Link to="/wishlist" className="chip action-chip">
          Wishlist
        </Link>
        <Link to="/cart" className="chip action-chip">
          Cart <span className="badge">{cartCount}</span>
        </Link>
        {authSummary.isLoggedIn ? (
          <>
            <div className="user-chip">
              <span className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'G'}</span>
              <div>
                <strong>{user?.name || 'Guest'}</strong>
                <small>{user?.role === 'ROLE_ADMIN' ? 'Admin access' : 'Customer account'}</small>
              </div>
            </div>
            <button type="button" className="chip ghost-chip" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  )
}
