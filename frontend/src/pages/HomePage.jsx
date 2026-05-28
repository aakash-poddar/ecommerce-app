import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ProductCard, SectionTitle, Shell } from '../components/ShopUI'
import { useShop } from '../context/useShop'

export function HomePage() {
  const { products, categories, cartCount, cartItems, wishlistItems, addToCart, toggleWishlist, user, logout } = useShop()
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4)
  const stats = [
    { label: 'Verified products', value: '120+' },
    { label: 'Happy shoppers', value: '8.4k' },
    { label: 'Fast delivery zones', value: '32' },
  ]

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack">
        <section className="hero-grid card hero-card">
          <div className="hero-copy">
            <p className="eyebrow">ShopEase commerce system</p>
            <h1>Shop your favorite products with a cleaner, faster frontend.</h1>
            <p className="description">
              Built from the backend APIs and wireframes in your docs, with a polished ecommerce UI for login,
              catalog browsing, cart, wishlist, checkout, orders, and admin preview.
            </p>
            <div className="button-row">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((item) => (
                <div key={item.label} className="hero-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-panel hero-panel-main">
              <div className="hero-phone">
                <span className="hero-badge">New drop</span>
                <div className="hero-shirt" />
                <div className="hero-bag hero-bag-left" />
                <div className="hero-bag hero-bag-right" />
              </div>
            </div>
            <div className="hero-floating hero-floating-one">{cartCount} cart items</div>
            <div className="hero-floating hero-floating-two">{wishlistItems.length} wishlist picks</div>
            <div className="hero-floating hero-floating-three">{cartItems.length} saved carts</div>
          </div>
        </section>

        <section className="card section-card">
          <SectionTitle title="Categories" description="The same category-first flow shown in the wireframes." />
          <div className="chip-grid">
            {categories.map((category) => (
              <Link key={category} to="/products" className="category-chip">
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="card section-card">
          <SectionTitle title="Featured Products" description="Highlights pulled from the product catalog." action={<Link to="/products">View all</Link>} />
          <div className="product-grid featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={false}
              />
            ))}
          </div>
        </section>
      </main>
    </Shell>
  )
}
