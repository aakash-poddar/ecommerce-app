import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  MetricCard,
  PageTitle,
  ProductCard,
  SectionTitle,
  Select,
  Shell,
  StatusBadge,
  Textarea,
  TextButton,
} from '../components/ShopUI'
import { Header } from '../components/Header'
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

function AuthPageFrame({ title, subtitle, children, sideTitle, sideDescription }) {
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

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useShop()
  const [form, setForm] = useState({ email: 'guest@shopease.com', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    login({
      name: form.email.split('@')[0] || 'User',
      email: form.email,
    })
    navigate('/products')
  }

  return (
    <AuthPageFrame
      title="Welcome Back!"
      subtitle="Login to continue"
      sideTitle="Login Page"
      sideDescription="Matches the wireframe pattern with a centered auth card and a soft commerce illustration."
    >
      <PageTitle eyebrow="Authentication" title="Welcome back" description="Use the backend login endpoint conceptually, while the frontend previews the session flow." />
      <form className="form-grid" onSubmit={handleSubmit}>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </Field>
        <div className="button-row form-actions">
          <Button type="submit">Login</Button>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </form>
      <p className="form-note">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthPageFrame>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useShop()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }

    setError('')
    register({
      name: form.name,
      email: form.email,
    })
    navigate('/products')
  }

  return (
    <AuthPageFrame
      title="Create Account"
      subtitle="Sign up to get started"
      sideTitle="Register Page"
      sideDescription="Styled to mirror the register wireframe with a clean form, strong hierarchy, and pastel emphasis."
    >
      <PageTitle eyebrow="Authentication" title="Create your account" description="The frontend form mirrors the backend register API fields and role concept." />
      <form className="form-grid" onSubmit={handleSubmit}>
        <Field label="Full Name">
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </Field>
        <Field label="Confirm Password">
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
          />
        </Field>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="button-row form-actions">
          <Button type="submit">Create Account</Button>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </form>
      <p className="form-note">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthPageFrame>
  )
}

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
              <MetricCard label="Products" value={filteredProducts.length} tone="violet" />
              <MetricCard label="Wishlist" value={wishlistItems.length} tone="teal" />
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
        <PageTitle
          eyebrow="Catalog"
          title="Product Details Page"
          description="A closer view with image column, price block, quantity control, cart, and wishlist actions."
        />

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

export function CartPage() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, updateCartQuantity, removeFromCart, cartCount, user, logout, formatCurrency } = useShop()
  const shipping = cartItems.length ? 79 : 0
  const total = cartTotal + shipping

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack split-layout">
        <div className="content-column">
          <PageTitle eyebrow="Cart" title="My Cart" description="Line item table and summary block inspired by the cart wireframe." />
          <Card className="table-card">
            {cartItems.length ? (
              <div className="cart-table">
                <div className="cart-table-head">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item.productId} className="cart-table-row">
                    <div className="cart-product">
                      <div className="mini-media" style={{ background: item.product.accent }}>
                        <img className="mini-media-image" src={item.product.image} alt={item.product.name} loading="lazy" />
                      </div>
                      <div>
                        <strong>{item.product.name}</strong>
                        <p>{item.product.category}</p>
                      </div>
                    </div>
                    <span>{formatCurrency(item.product.price)}</span>
                    <div className="quantity-picker small">
                      <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>-</button>
                      <strong>{item.quantity}</strong>
                      <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-total-cell">
                      <span>{formatCurrency(item.subtotal)}</span>
                      <button type="button" className="icon-button danger" onClick={() => removeFromCart(item.productId)}>
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Your cart is empty"
                description="Add products from the listing page to see the checkout summary here."
                action={
                  <Link to="/products" className="btn btn-primary">
                    Continue shopping
                  </Link>
                }
              />
            )}
          </Card>
        </div>

        <aside className="card summary-card">
          <SectionTitle title="Cart Summary" />
          <div className="summary-list">
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatCurrency(shipping)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
          <Button onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          <Link to="/products" className="btn btn-secondary btn-wide">
            Continue Shopping
          </Link>
        </aside>
      </main>
    </Shell>
  )
}

export function WishlistPage() {
  const { wishlistItems, moveWishlistToCart, removeFromWishlist, cartCount, user, logout, formatCurrency } = useShop()

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack">
        <PageTitle eyebrow="Wishlist" title="My Wishlist" description="Saved products arranged in a grid like the wireframe." />
        <section className="card section-card">
          {wishlistItems.length ? (
            <>
              <div className="product-grid wishlist-grid">
                {wishlistItems.map((product) => (
                  <article key={product.id} className="wishlist-card">
                    <div className="wishlist-media" style={{ background: product.accent }}>
                      <img className="wishlist-media-image" src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="wishlist-body">
                      <strong>{product.name}</strong>
                      <p>{formatCurrency(product.price)}</p>
                    </div>
                    <div className="button-row compact-row">
                      <Button onClick={() => moveWishlistToCart(product.id)}>Move to Cart</Button>
                      <TextButton onClick={() => removeFromWishlist(product.id)}>Remove</TextButton>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Wishlist is empty"
              description="Save products from listing or product details page to fill this section."
              action={
                <Link to="/products" className="btn btn-primary">
                  Browse products
                </Link>
              }
            />
          )}
        </section>
      </main>
    </Shell>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, cartCount, placeOrder, user, logout, formatCurrency } = useShop()
  const shipping = cartItems.length ? 79 : 0
  const total = cartTotal + shipping
  const [form, setForm] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    placeOrder({
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
    })
    navigate('/orders')
  }

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack split-layout">
        <div className="content-column">
          <PageTitle eyebrow="Checkout" title="Shipping Address" description="Checkout card and order summary are arranged like the wireframe." />
          <Card className="checkout-card">
            <form className="form-grid checkout-form" onSubmit={handleSubmit}>
              <Field label="Full Name">
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </Field>
              <Field label="Address">
                <Textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows={3} />
              </Field>
              <Field label="City">
                <Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
              </Field>
              <Field label="Pincode">
                <Input value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
              </Field>
              <Field label="Phone Number">
                <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </Field>
              <Field label="Payment Method">
                <Select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
                  <option>Cash on Delivery</option>
                  <option>UPI</option>
                  <option>Card</option>
                </Select>
              </Field>
              <Button type="submit" disabled={!cartItems.length}>{cartItems.length ? 'Place Order' : 'Cart is empty'}</Button>
            </form>
          </Card>
        </div>
        <aside className="card summary-card">
          <SectionTitle title="Order Summary" />
          <div className="summary-list">
            <div>
              <span>Items ({cartItems.length})</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatCurrency(shipping)}</strong>
            </div>
            <div className="summary-total">
              <span>Total Amount</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
          <div className="payment-pill">Cash on Delivery (COD)</div>
        </aside>
      </main>
    </Shell>
  )
}

export function OrdersPage() {
  const { orders, cartCount, user, logout, formatCurrency } = useShop()

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack">
        <PageTitle eyebrow="Orders" title="My Orders" description="Order history list inspired by the wireframe history panel." />
        <section className="card section-card orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div>
                <strong>Order #{order.id}</strong>
                <p>{order.items} items - {formatCurrency(order.amount)}</p>
                <small>{order.date}</small>
              </div>
              <div className="order-actions">
                <StatusBadge status={order.status} />
                <TextButton>View Details</TextButton>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Shell>
  )
}

export function AdminPage() {
  const { adminStats, orders, products, cartCount, user, logout, formatCurrency } = useShop()
  const [productForm, setProductForm] = useState({ name: '', price: '', category: 'Electronics', stock: '', description: '' })

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack admin-layout">
        <aside className="admin-sidebar card">
          <div className="admin-profile">
            <span className="avatar large">A</span>
            <div>
              <strong>Admin</strong>
              <p>Dashboard access</p>
            </div>
          </div>
          <nav className="admin-nav">
            <a href="#dashboard">Dashboard</a>
            <a href="#products">Products</a>
            <a href="#orders">Orders</a>
            <a href="#logout">Logout</a>
          </nav>
        </aside>

        <section className="admin-main" id="dashboard">
          <PageTitle eyebrow="Admin" title="Admin Dashboard" description="Stats, add-product form, recent orders, and inventory table follow the wireframe structure." />
          <div className="admin-stats">
            {adminStats.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
            ))}
          </div>

          <div className="admin-panels">
            <Card className="admin-form-panel" id="products">
              <SectionTitle title="Add New Product" />
              <form className="form-grid">
                <Field label="Product Name">
                  <Input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                </Field>
                <Field label="Price">
                  <Input value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} />
                </Field>
                <Field label="Category">
                  <Select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home & Living</option>
                    <option>Beauty</option>
                    <option>Sports</option>
                  </Select>
                </Field>
                <Field label="Stock">
                  <Input value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} />
                </Field>
                <Field label="Description">
                  <Textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} rows={4} />
                </Field>
                <Button type="submit">Add Product</Button>
              </form>
            </Card>

            <Card className="admin-orders-panel" id="orders">
              <SectionTitle title="Recent Orders" />
              <div className="orders-list compact">
                {orders.slice(0, 3).map((order) => (
                  <article key={order.id} className="order-card">
                    <div>
                      <strong>#{order.id}</strong>
                      <p>{order.items} items - {formatCurrency(order.amount)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </article>
                ))}
              </div>
            </Card>
          </div>

          <Card className="table-card">
            <SectionTitle title="Products" description="Inventory table like the wireframe admin section." />
            <div className="inventory-table">
              <div className="cart-table-head">
                <span>ID</span>
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Action</span>
              </div>
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="cart-table-row inventory-row">
                  <span>{product.id}</span>
                  <div className="cart-product">
                    <div className="mini-media" style={{ background: product.accent }}>
                      <img className="mini-media-image" src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <strong>{product.name}</strong>
                  </div>
                  <span>{formatCurrency(product.price)}</span>
                  <span>{product.stock}</span>
                  <div className="order-actions">
                    <TextButton>Edit</TextButton>
                    <TextButton>Delete</TextButton>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </Shell>
  )
}
