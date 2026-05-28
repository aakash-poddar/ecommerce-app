import { useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'
import { adminStats, categories, orders as seedOrders, products } from '../data/mockData'
import { ShopContext } from './shopContext'

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

export function ShopProvider({ children }) {
  const [user, setUser] = useState(() => readStoredValue(storageKeys.user, defaultUser))
  const [isAuthenticated, setIsAuthenticated] = useState(() => readStoredValue(storageKeys.auth, false))
  const [token, setToken] = useState(() => readStoredValue(storageKeys.token, null))
  const [cart, setCart] = useState(() => readStoredValue(storageKeys.cart, defaultCart))
  const [wishlist, setWishlist] = useState(() => readStoredValue(storageKeys.wishlist, defaultWishlist))
  const [orders, setOrders] = useState(() => readStoredValue(storageKeys.orders, seedOrders))

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

  useEffect(() => {
    localStorage.setItem(storageKeys.cart, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(storageKeys.wishlist, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem(storageKeys.orders, JSON.stringify(orders))
  }, [orders])

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
        const product = products.find((entry) => entry.id === item.productId)
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
  }, [cart])

  const wishlistItems = useMemo(() => {
    return wishlist
      .map((productId) => products.find((entry) => entry.id === productId))
      .filter(Boolean)
  }, [wishlist])

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems])
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  // toast instance (ToastProvider wraps ShopProvider in App.jsx)
  let toast = { show: () => {} }
  try {
    toast = useToast()
  } catch (e) {}

  const login = ({ name, email, role = 'ROLE_USER' }) => {
    // support API payloads which include token, username, role
    if (email == null && name && name.token) {
      const payload = name // in case caller passed the API response
      setToken(payload.token)
      setUser({ name: payload.username || payload.email?.split('@')[0] || 'User', email: payload.username || payload.email, role: payload.role || 'ROLE_USER' })
      setIsAuthenticated(true)
      return
    }

    if (name && name.token) {
      const payload = name
      setToken(payload.token)
      setUser({ name: payload.username || payload.email?.split('@')[0] || 'User', email: payload.username || payload.email, role: payload.role || 'ROLE_USER' })
      setIsAuthenticated(true)
      return
    }

    setUser({
      name,
      email,
      role,
    })
    setIsAuthenticated(true)
  }

  const register = ({ name, email, role = 'ROLE_USER' }) => {
    // When registration happens via API, caller may pass token payload
    if (name && name.token) {
      const payload = name
      setToken(payload.token)
      setUser({ name: payload.username || payload.email?.split('@')[0] || 'User', email: payload.username || payload.email, role: payload.role || 'ROLE_USER' })
      setIsAuthenticated(true)
      return
    }

    setUser({
      name,
      email,
      role,
    })
    setIsAuthenticated(true)
    try {
      toast.show('Registration successful', { type: 'success' })
    } catch (e) {}
  }

  const logout = () => {
    setUser(defaultUser)
    setIsAuthenticated(false)
    setToken(null)
  }

  const addToCart = (productId, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { productId, quantity }]
    })
    try {
      toast.show('Added to cart', { type: 'success' })
    } catch (e) {}
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
    try {
      toast.show('Removed from cart', { type: 'info' })
    } catch (e) {}
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
    try {
      const isAdded = !wishlist.includes(productId)
      toast.show(isAdded ? 'Added to wishlist' : 'Removed from wishlist', { type: 'info' })
    } catch (e) {}
  }

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((id) => id !== productId))
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

    setOrders((current) => [order, ...current])
    clearCart()
    try {
      toast.show('Order placed successfully', { type: 'success' })
    } catch (e) {}
    return order
  }

  const getProductById = (productId) => products.find((entry) => entry.id === Number(productId))

  const value = {
    user,
    token,
    categories,
    products,
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
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

