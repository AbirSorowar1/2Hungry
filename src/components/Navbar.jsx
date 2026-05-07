import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { itemCount, dispatch } = useCart();
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out. See you soon! 👋');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', emoji: '🏠' },
    { to: '/orders', label: 'Orders', emoji: '📦' },
    { to: '/profile', label: 'Profile', emoji: '👤' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-4'
        }`}
      >
        <div className={`mx-4 md:mx-8 rounded-2xl transition-all duration-300 ${
          scrolled ? 'glass shadow-xl' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl
                transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
                🍔
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                2<span style={{ color: '#00BFA6' }}>Hungry</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive(link.to) ? 'text-tiya-500 bg-tiya-50 dark:bg-tiya-900/20' : ''
                  }`}
                  style={{ color: isActive(link.to) ? '#00BFA6' : 'var(--text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggle}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Cart button */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(0, 191, 166, 0.12)' }}
              >
                <span className="text-lg">🛒</span>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: '#00BFA6' }}
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(0, 191, 166, 0.08)' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
                    {user?.photoURL
                      ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      : (user?.displayName?.[0] || user?.email?.[0] || '?').toUpperCase()
                    }
                  </div>
                  <span className="hidden md:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user?.displayName?.split(' ')[0] || 'You'}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl overflow-hidden"
                      style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
                    >
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-tiya-50 dark:hover:bg-tiya-900/20"
                        style={{ color: 'var(--text-primary)' }}>
                        <span>👤</span> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-tiya-50 dark:hover:bg-tiya-900/20"
                        style={{ color: 'var(--text-primary)' }}>
                        <span>📦</span> My Orders
                      </Link>
                      <div style={{ borderTop: '1px solid var(--border)' }} />
                      <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-900/20"
                        style={{ color: '#ef4444' }}>
                        <span>🚪</span> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--border)' }}
              >
                <div className="flex flex-col gap-1">
                  <span className={`block w-4 h-0.5 rounded-full transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                    style={{ background: 'var(--text-primary)' }} />
                  <span className={`block w-4 h-0.5 rounded-full transition-all ${mobileOpen ? 'opacity-0' : ''}`}
                    style={{ background: 'var(--text-primary)' }} />
                  <span className={`block w-4 h-0.5 rounded-full transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                    style={{ background: 'var(--text-primary)' }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl shadow-xl overflow-hidden md:hidden"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
          >
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-5 py-4 text-base font-medium transition-colors duration-150 ${
                  isActive(link.to) ? 'text-tiya-500 bg-tiya-50 dark:bg-tiya-900/20' : ''
                }`}
                style={{ color: isActive(link.to) ? '#00BFA6' : 'var(--text-primary)' }}>
                <span className="text-xl">{link.emoji}</span> {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {(profileOpen || mobileOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setProfileOpen(false); setMobileOpen(false); }} />
      )}
    </>
  );
}
