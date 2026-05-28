import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section className="footer-section">
          <p className="footer-title">About</p>
          <Link to="/">Contact Us</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">ShopEase Stories</Link>
          <Link to="/">Press</Link>
        </section>
        <section className="footer-section">
          <p className="footer-title">Shop</p>
          <Link to="/products">All Products</Link>
          <Link to="/products">Electronics</Link>
          <Link to="/products">Fashion</Link>
          <Link to="/products">Sports</Link>
        </section>
        <section className="footer-section">
          <p className="footer-title">Help</p>
          <Link to="/cart">Payments</Link>
          <Link to="/cart">Shipping</Link>
          <Link to="/orders">Cancellation & Returns</Link>
          <Link to="/orders">FAQ</Link>
        </section>
        <section className="footer-section">
          <p className="footer-title">Policy</p>
          <Link to="/">Terms Of Use</Link>
          <Link to="/">Security</Link>
          <Link to="/">Privacy</Link>
          <Link to="/">Sitemap</Link>
        </section>
        <section className="footer-section footer-meta">
          <p className="footer-title">Contact</p>
          <strong>ShopEase Internet Private Limited</strong>
          <p>Built for your ecommerce frontend from the provided backend and wireframes.</p>
          <div className="footer-social" aria-label="Social links">
            <a className="social-pill" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a className="social-pill" href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              x
            </a>
            <a className="social-pill" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              ▶
            </a>
            <a className="social-pill" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              ◌
            </a>
          </div>
        </section>
      </div>
    </footer>
  )
}
