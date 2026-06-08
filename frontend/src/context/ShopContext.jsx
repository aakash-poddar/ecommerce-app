import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import { useToast } from './ToastContext'
import { adminStats, categories, orders as seedOrders, products } from '../data/mockData'
import { ShopContext } from './shopContext'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000'
const accentPalette = [
  'linear-gradient(135deg, #111827, #6b7280)',
  'linear-gradient(135deg, #312e81, #818cf8)',
  'linear-gradient(135deg, #f43f5e, #fda4af)',
  'linear-gradient(135deg, #92400e, #f59e0b)',
  'linear-gradient(135deg, #0f172a, #94a3b8)',
  'linear-gradient(135deg, #451a03, #f97316)',
  'linear-gradient(135deg, #0f766e, #14b8a6)',
  'linear-gradient(135deg, #9d174d, #f9a8d4)',
  'linear-gradient(135deg, #111827, #22c55e)',
  'linear-gradient(135deg, #334155, #cbd5e1)',
]

const resolveImageUrl = (imageUrl) => {
  const value = String(imageUrl || '').trim()
  if (!value) return ''
  if (/^data:image\//i.test(value)) return value
  if (value.startsWith('/uploads/')) return `${API_ORIGIN}${value}`
  if (value.startsWith('/assets/')) return value

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      const pathname = String(url.pathname || '').toLowerCase()
      const isDirectImage = /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i.test(pathname)
      return isDirectImage ? value : ''
    } catch {
      return ''
    }
  }

  return ''
}

const isValidImageInput = (value) => !value || Boolean(resolveImageUrl(value))

const normalizeName = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const catalogFallbackById = new Map(products.map((product) => [Number(product.id), product]))
const catalogFallbackByName = new Map(products.map((product) => [normalizeName(product.name), product]))

const normalizeProduct = (product, index = 0) => {
  const fallback = catalogFallbackById.get(Number(product.id)) || catalogFallbackByName.get(normalizeName(product.name)) || {}
  const resolvedImage = resolveImageUrl(product.image) || resolveImageUrl(product.imageUrl) || resolveImageUrl(fallback.image)

  return {
    ...fallback,
    ...product,
    id: Number(product.id),
    image: resolvedImage,
    imageUrl: product.imageUrl || product.image || fallback.image || '',
    rating: product.rating ?? fallback.rating ?? 4.2,
    reviews: product.reviews ?? fallback.reviews ?? 0,
    color: product.color ?? fallback.color ?? 'Standard',
    featured: product.featured ?? fallback.featured ?? false,
    accent: product.accent || fallback.accent || accentPalette[index % accentPalette.length],
  }
}

const storageKeys = {
  user: 'shopEaseUser',
  auth: 'shopEaseAuth',
  token: 'shopEaseToken',
  cart: 'shopEaseCart',
  wishlist: 'shopEaseWishlist',
  orders: 'shopEaseOrders',
}

const readStoredValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`

const defaultCart = [
  { productId: 1, quantity: 1 },
  { productId: 3, quantity: 2 },
]

const defaultWishlist = [2, 8]

const defaultUser = {
  name: 'Guest User',
  email: 'guest@shopease.com',
  role: 'ROLE_USER',
}

const guestState = {
  cart: defaultCart,
  wishlist: defaultWishlist,
  orders: seedOrders,
}

const emptyState = {
  cart: [],
  wishlist: [],
  orders: [],
}

const sanitizeScope = (email) => String(email || 'guest').toLowerCase().replace(/[^a-z0-9]+/g, '_')

const getScope = (user, isAuthenticated) => (isAuthenticated ? sanitizeScope(user?.email) : 'guest')

const getScopedKey = (key, scope) => `${key}:${scope}`

const loadScopedState = (scope, fallbackState) => ({
  cart: readStoredValue(getScopedKey(storageKeys.cart, scope), fallbackState.cart),
  wishlist: readStoredValue(getScopedKey(storageKeys.wishlist, scope), fallbackState.wishlist),
  orders: readStoredValue(getScopedKey(storageKeys.orders, scope), fallbackState.orders),
})

const persistScopedState = (scope, state) => {
  localStorage.setItem(getScopedKey(storageKeys.cart, scope), JSON.stringify(state.cart))
  localStorage.setItem(getScopedKey(storageKeys.wishlist, scope), JSON.stringify(state.wishlist))
  localStorage.setItem(getScopedKey(storageKeys.orders, scope), JSON.stringify(state.orders))
}

export function ShopProvider({ children }) {
  const [user, setUser] = useState(() => readStoredValue(storageKeys.user, defaultUser))
  const [isAuthenticated, setIsAuthenticated] = useState(() => readStoredValue(storageKeys.auth, false))
  const [token, setToken] = useState(() => readStoredValue(storageKeys.token, null))

  const initialScope = getScope(user, isAuthenticated)
  const initialState = isAuthenticated ? emptyState : guestState

  const [cart, setCart] = useState(() => loadScopedState(initialScope, initialState).cart)
  const [wishlist, setWishlist] = useState(() => loadScopedState(initialScope, initialState).wishlist)
  const [orders, setOrders] = useState(() => loadScopedState(initialScope, initialState).orders)
  const [productsState, setProductsState] = useState(() => products.map((product, index) => normalizeProduct(product, index)))

  useEffect(() => {
    let cancelled = false

    client
      .get('/products')
      .then((response) => {
        if (cancelled) return
        const nextProducts = Array.isArray(response.data) ? response.data.map((product, index) => normalizeProduct(product, index)) : []
        if (nextProducts.length) {
          setProductsState(nextProducts)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProductsState(products.map((product, index) => normalizeProduct(product, index)))
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKeys.user, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem(storageKeys.auth, JSON.stringify(isAuthenticated))
  }, [isAuthenticated])

  useEffect(() => {
    if (token) localStorage.setItem(storageKeys.token, JSON.stringify(token))
    else localStorage.removeItem(storageKeys.token)
  }, [token])

  const authSummary = useMemo(
    () => ({
      isAdmin: user?.role === 'ROLE_ADMIN',
      isLoggedIn: isAuthenticated,
    }),
    [isAuthenticated, user],
  )

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = productsState.find((entry) => entry.id === item.productId)
        if (!product) return null
        const quantity = Math.max(1, item.quantity)
        return {
          ...item,
          product,
          quantity,
          subtotal: product.price * quantity,
        }
      })
      .filter(Boolean)
  }, [cart, productsState])

  const wishlistItems = useMemo(() => {
    return wishlist
      .map((productId) => productsState.find((entry) => entry.id === productId))
      .filter(Boolean)
  }, [wishlist, productsState])

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems])
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  let toast = { show: () => {} }
  try {
    toast = useToast()
  } catch (e) {}

  const getActiveScope = () => getScope(user, isAuthenticated)

  const persistCurrentSession = (nextState) => {
    persistScopedState(getActiveScope(), nextState)
  }

  const loadSessionForEmail = (email) => loadScopedState(sanitizeScope(email), emptyState)

  const applyApiSession = (payload, authenticate = true) => {
    const resolvedEmail = payload.email || payload.username
    const sessionState = loadSessionForEmail(resolvedEmail)

    setUser({
      name: payload.name || payload.username || resolvedEmail?.split('@')[0] || 'User',
      email: resolvedEmail,
      role: payload.role || 'ROLE_USER',
    })
    setToken(payload.token || null)
    setIsAuthenticated(authenticate)
    setCart(sessionState.cart)
    setWishlist(sessionState.wishlist)
    setOrders(sessionState.orders)
  }

  const login = ({ name, email, role = 'ROLE_USER' }) => {
    if (name && name.token) {
      applyApiSession(name, true)
      return
    }

    const nextUser = {
      name,
      email,
      role,
    }
    const sessionState = loadSessionForEmail(email)

    setUser(nextUser)
    setIsAuthenticated(true)
    setToken(null)
    setCart(sessionState.cart)
    setWishlist(sessionState.wishlist)
    setOrders(sessionState.orders)
  }

  const register = ({ name, email, role = 'ROLE_USER' }) => {
    if (name && name.token) {
      applyApiSession(name, true)
      return
    }

    setUser({
      name,
      email,
      role,
    })
    setIsAuthenticated(false)
    setToken(null)
  }

  const logout = () => {
    setUser(defaultUser)
    setIsAuthenticated(false)
    setToken(null)
    setCart(guestState.cart)
    setWishlist(guestState.wishlist)
    setOrders(guestState.orders)
    persistScopedState('guest', guestState)
  }

  const addToCart = (productId, quantity = 1) => {
    const existing = cart.find((item) => item.productId === productId)
    const nextCart = existing
      ? cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item))
      : [...cart, { productId, quantity }]

    setCart(nextCart)
    persistCurrentSession({ cart: nextCart, wishlist, orders })

    try {
      toast.show('Added to cart', { type: 'success' })
    } catch (e) {}
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const nextCart = cart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    setCart(nextCart)
    persistCurrentSession({ cart: nextCart, wishlist, orders })
  }

  const removeFromCart = (productId) => {
    const nextCart = cart.filter((item) => item.productId !== productId)
    setCart(nextCart)
    persistCurrentSession({ cart: nextCart, wishlist, orders })

    try {
      toast.show('Removed from cart', { type: 'info' })
    } catch (e) {}
  }

  const clearCart = () => {
    setCart([])
    persistCurrentSession({ cart: [], wishlist, orders })
  }

  const toggleWishlist = (productId) => {
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId]

    setWishlist(nextWishlist)
    persistCurrentSession({ cart, wishlist: nextWishlist, orders })

    try {
      const isAdded = !wishlist.includes(productId)
      toast.show(isAdded ? 'Added to wishlist' : 'Removed from wishlist', { type: 'info' })
    } catch (e) {}
  }

  const removeFromWishlist = (productId) => {
    const nextWishlist = wishlist.filter((id) => id !== productId)
    setWishlist(nextWishlist)
    persistCurrentSession({ cart, wishlist: nextWishlist, orders })
  }

  const moveWishlistToCart = (productId) => {
    addToCart(productId, 1)
    removeFromWishlist(productId)
  }

  const placeOrder = ({ address, phone, paymentMethod }) => {
    const order = {
      id: `ORD${Math.floor(10000 + Math.random() * 90000)}`,
      items: cartItems.length,
      amount: cartTotal + 79,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      address,
      phone,
      paymentMethod,
      products: cartItems,
    }

    const nextOrders = [order, ...orders]
    setOrders(nextOrders)
    setCart([])
    persistCurrentSession({ cart: [], wishlist, orders: nextOrders })

    try {
      toast.show('Order placed successfully', { type: 'success' })
    } catch (e) {}
    return order
  }

  const getProductById = (productId) => productsState.find((entry) => entry.id === Number(productId))

  const createProduct = async (form, file) => {
    // basic client-side validation
    if (!form.name || !form.description) throw new Error('Name and description are required')
    const price = Number(form.price)
    const stockVal = Number(form.stock)
    if (Number.isNaN(price) || price <= 0) throw new Error('Price must be a positive number')
    if (!Number.isInteger(stockVal) || stockVal < 0) throw new Error('Stock must be a non-negative integer')

    const payload = {
      name: form.name,
      description: form.description,
      price: price,
      category: form.category,
      stock: stockVal,
      imageUrl: form.imageUrl || '',
    }

    if (!isValidImageInput(payload.imageUrl)) {
      throw new Error('Please provide a direct image URL ending with .jpg, .png, .webp, etc.')
    }

    const fd = new FormData()
    fd.append('food', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (file) fd.append('file', file)

    const resp = await client.post('/products', fd)

    const created = resp.data

    const uiProduct = normalizeProduct(created, 0)

    setProductsState((prev) => [uiProduct, ...prev])
    return created
  }

  const deleteProduct = async (id) => {
    await client.delete(`/products/${id}`)
    setProductsState((prev) => prev.filter((p) => p.id !== id))
  }

  const updateProduct = async (id, form, file) => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      imageUrl: form.imageUrl || '',
    }

    if (!isValidImageInput(payload.imageUrl)) {
      throw new Error('Please provide a direct image URL ending with .jpg, .png, .webp, etc.')
    }

    const fd = new FormData()
    fd.append('food', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (file) fd.append('file', file)

    const resp = await client.put(`/products/${id}`, fd)
    const updated = resp.data

    setProductsState((prev) => prev.map((p) => (p.id === Number(updated.id) ? normalizeProduct({ ...p, ...updated }, 0) : p)))
    return updated
  }

  const value = {
    user,
    token,
    categories,
    products: productsState,
    orders,
    adminStats,
    cartItems,
    wishlistItems,
    cartTotal,
    cartCount,
    isAuthenticated,
    authSummary,
    login,
    register,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    placeOrder,
    getProductById,
    formatCurrency,
    createProduct,
    deleteProduct,
    updateProduct,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
