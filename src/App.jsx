import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { OrdersProvider } from './context/OrdersContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FoodDetailPage from './pages/FoodDetailPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-bounce">🍔</div>
        <div className="w-10 h-10 border-3 border-tiya-500 border-t-transparent rounded-full animate-spin"
          style={{ borderWidth: '3px', borderColor: '#00BFA6', borderTopColor: 'transparent' }} />
        <p className="text-tiya-500 font-display font-semibold">Loading 2Hungry...</p>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><HomePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/food/:id" element={
        <ProtectedRoute>
          <AppLayout><FoodDetailPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <AppLayout><OrdersPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><ProfilePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <AppRoutes />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: {
                      borderRadius: '16px',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '14px',
                    },
                    success: {
                      iconTheme: { primary: '#00BFA6', secondary: '#fff' },
                    },
                  }}
                />
              </OrdersProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
