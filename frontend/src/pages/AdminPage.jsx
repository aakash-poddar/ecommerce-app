import { Button, Card, Field, Input, MetricCard, PageTitle, SectionTitle, Select, Shell, StatusBadge, Textarea, TextButton } from '../components/ShopUI'
import { Header } from '../components/Header'
import { useShop } from '../context/useShop'
import { useState } from 'react'

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
