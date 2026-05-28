import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, EmptyState, Input, PageTitle, ProductCard, SectionTitle, Select, Shell, StatusBadge } from '../components/ShopUI'
import { Header } from '../components/Header'
import { useShop } from '../context/useShop'

export function ProductsPage() {
  const { products, categories, addToCart, toggleWishlist, wishlistItems, cartCount, user, logout } = useShop()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesQuery = [product.name, product.description, product.category].join(' ').toLowerCase().includes(query.toLowerCase())
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory
        return matchesQuery && matchesCategory
      })
      .sort((left, right) => {
        if (sortBy === 'price-asc') return left.price - right.price
        if (sortBy === 'price-desc') return right.price - left.price
        if (sortBy === 'rating') return right.rating - left.rating
        return right.id - left.id
      })
  }, [activeCategory, products, query, sortBy])

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack listing-layout">
        <PageTitle
          eyebrow="Catalog"
          title="Product Listing Page"
          description="Search, category, filter, and sort flows mirror the wireframe while staying connected to backend product fields."
        />
        <section className="listing-toolbar card">
          <div className="search-box">
            <Input placeholder="Search products..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="toolbar-right">
            <span className="muted">Sort by</span>
            <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </Select>
          </div>
        </section>

        <div className="listing-grid">
          <aside className="card filter-panel">
            <SectionTitle title="Categories" description="Quick filter like the wireframe sidebar." />
            <div className="filter-list">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-item ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="filter-summary">
              <div className="metric metric-violet">
                <span>Products</span>
                <strong>{filteredProducts.length}</strong>
              </div>
              <div className="metric metric-teal">
                <span>Wishlist</span>
                <strong>{wishlistItems.length}</strong>
              </div>
            </div>
          </aside>

          <section className="product-grid listing-products">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistItems.some((item) => item.id === product.id)}
              />
            ))}
          </section>
        </div>
      </main>
    </Shell>
  )
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, addToCart, toggleWishlist, wishlistItems, cartCount, user, logout, formatCurrency } = useShop()
  const product = getProductById(id)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <Shell>
        <Header cartCount={cartCount} user={user} onLogout={logout} />
        <main className="page-stack">
          <EmptyState
            title="Product not found"
            description="The selected product does not exist in the current catalog."
            action={
              <Link to="/products" className="btn btn-primary">
                Back to products
              </Link>
            }
          />
        </main>
      </Shell>
    )
  }

  const onAdd = () => {
    addToCart(product.id, quantity)
    navigate('/cart')
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack detail-layout">
        <PageTitle eyebrow="Catalog" title="Product Details Page" description="A closer view with image column, price block, quantity control, cart, and wishlist actions." />
        <section className="card detail-card">
          <div className="gallery-column">
            <div className="thumbnail-stack">
              <div className="thumbnail selected" style={{ background: product.accent }}>
                <img className="thumbnail-image" src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="thumbnail" style={{ background: 'linear-gradient(135deg, #c4b5fd, #f5d0fe)' }}>
                {product.category.slice(0, 2).toUpperCase()}
              </div>
              <div className="thumbnail" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
                {product.color.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="main-media" style={{ background: product.accent }}>
              <img className="main-media-image" src={product.image} alt={product.name} loading="lazy" />
            </div>
          </div>
          <div className="detail-panel">
            <div className="breadcrumb">Home &gt; {product.category} &gt; {product.name}</div>
            <h1 className="detail-title">{product.name}</h1>
            <div className="rating-row">
              <span className="stars">{product.rating} ★</span>
              <span>{product.reviews} reviews</span>
              <StatusBadge status={product.stock > 0 ? 'Available' : 'Out Of Stock'} />
            </div>
            <strong className="detail-price">{formatCurrency(product.price)}</strong>
            <p className="description">{product.description}</p>
            <div className="choice-row">
              <span className="muted">Color</span>
              <div className="color-dots">
                <span className="dot dot-dark" />
                <span className="dot dot-blue" />
                <span className="dot dot-red" />
                <span className="dot dot-light" />
              </div>
            </div>
            <div className="choice-row">
              <span className="muted">Quantity</span>
              <div className="quantity-picker">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
              </div>
            </div>
            <div className="button-row detail-actions">
              <Button onClick={onAdd}>Add to Cart</Button>
              <Button variant="secondary" onClick={() => toggleWishlist(product.id)}>
                {isWishlisted ? 'Remove Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  )
}
