import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, EmptyState, Field, Input, PageTitle, SectionTitle, Select, Shell, StatusBadge, Textarea, TextButton } from '../components/ShopUI'
import { Header } from '../components/Header'
import { useShop } from '../context/useShop'

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
    const order = placeOrder({
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
    })
    navigate('/orders', { state: { orderPlaced: true, orderId: order.id } })
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
  const location = useLocation()
  const { orders, cartCount, user, logout, formatCurrency, authSummary } = useShop()
  const [allOrders, setAllOrders] = useState([])
  const visibleOrders = authSummary.isAdmin ? allOrders : orders
  const latestOrder = visibleOrders[0]

  useEffect(() => {
    // if admin, fetch all orders from backend
    if (authSummary.isAdmin) {
      import('../api/client').then(({ default: client }) => {
        client.get('/orders/all').then((res) => setAllOrders(res.data)).catch(() => {})
      })
    }
  }, [authSummary.isAdmin])

  return (
    <Shell>
      <Header cartCount={cartCount} user={user} onLogout={logout} />
      <main className="page-stack">
        <PageTitle eyebrow="Orders" title="My Orders" description="Order history list inspired by the wireframe history panel." />
        {location.state?.orderPlaced && latestOrder ? (
          <Card className="section-card">
            <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="eyebrow">Order placed successfully</p>
                <h2>Order #{latestOrder.id}</h2>
                <p>Your order has been placed and is visible only in your account.</p>
              </div>
              <StatusBadge status={latestOrder.status} />
            </div>
            <div className="summary-list" style={{ marginTop: '1rem' }}>
              <div>
                <span>Total amount</span>
                <strong>{formatCurrency(latestOrder.amount)}</strong>
              </div>
              <div>
                <span>Payment method</span>
                <strong>{latestOrder.paymentMethod || 'Cash on Delivery'}</strong>
              </div>
              <div>
                <span>Shipping address</span>
                <strong>{latestOrder.address}</strong>
              </div>
            </div>
          </Card>
        ) : null}
        <section className="card section-card orders-list">
          {visibleOrders.length ? (
            visibleOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div>
                  <strong>Order #{order.id}</strong>
                  <p>{order.items} items - {formatCurrency(order.amount)}</p>
                  <small>{order.date}</small>
                  {order.products ? (
                    <div>
                      {order.products.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <img src={p.product.image || p.image} alt={p.product?.name || p.name} width={48} />
                          <div>
                            <strong>{p.product?.name || p.name}</strong>
                            <div>Qty: {p.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="order-actions">
                  <StatusBadge status={order.status} />
                  <TextButton>View Details</TextButton>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="No orders yet"
              description="Once you place an order, it will show up here with full details for your account only."
              action={
                <Link to="/products" className="btn btn-primary">
                  Start shopping
                </Link>
              }
            />
          )}
        </section>
      </main>
    </Shell>
  )
}
