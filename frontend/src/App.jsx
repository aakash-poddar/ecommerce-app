import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <ShopProvider>
            <AppRoutes />
          </ShopProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
