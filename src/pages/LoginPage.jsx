import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const floatingFoods = ['🍔', '🍕', '🍜', '🌮', '🍣', '🥗', '🍟', '🥤', '🍰', '🫕'];

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Fill in all fields'); return; }
    if (mode === 'signup' && !name) { toast.error('Enter your name'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        toast.success(`Welcome to 2Hungry, ${name}! 🍔`);
      } else {
        await signIn(email, password);
        toast.success('Welcome back! 😋');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google! 🎉');
      navigate('/');
    } catch (err) {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a3d35 0%, #00BFA6 30%, #00a892 50%, #005c50 80%, #0a2920 100%)',
        }}>
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{ background: 'radial-gradient(circle, #7de9db, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #00BFA6, transparent)', filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #b3f2ea, transparent)', filter: 'blur(60px)',
            animation: 'float 10s ease-in-out 2s infinite' }} />
      </div>

      {/* Floating food icons */}
      {floatingFoods.map((food, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl select-none pointer-events-none"
          style={{
            left: `${5 + (i * 9.5) % 90}%`,
            top: `${10 + (i * 17) % 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        >
          {food}
        </motion.div>
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 191, 166, 0.3)',
          }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-5xl mb-3"
            >🍔</motion.div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              2<span style={{ color: '#00BFA6' }}>Hungry</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === 'login' ? 'Welcome back! 😋' : 'Join the feast! 🎉'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-2xl p-1 mb-6"
            style={{ background: 'rgba(0, 191, 166, 0.08)' }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize"
                style={{
                  background: mode === m ? '#00BFA6' : 'transparent',
                  color: mode === m ? 'white' : '#00BFA6',
                  boxShadow: mode === m ? '0 4px 12px rgba(0, 191, 166, 0.3)' : 'none',
                }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">👤</span>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                      style={{
                        borderColor: 'rgba(0, 191, 166, 0.25)',
                        background: 'rgba(0, 191, 166, 0.04)',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#00BFA6'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 191, 166, 0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(0, 191, 166, 0.25)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">📧</span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                style={{ borderColor: 'rgba(0, 191, 166, 0.25)', background: 'rgba(0, 191, 166, 0.04)' }}
                onFocus={e => { e.target.style.borderColor = '#00BFA6'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 191, 166, 0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0, 191, 166, 0.25)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                style={{ borderColor: 'rgba(0, 191, 166, 0.25)', background: 'rgba(0, 191, 166, 0.04)' }}
                onFocus={e => { e.target.style.borderColor = '#00BFA6'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 191, 166, 0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0, 191, 166, 0.25)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl text-white font-display font-bold text-base transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00BFA6, #00a892)',
                boxShadow: '0 6px 30px rgba(0, 191, 166, 0.4)',
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{mode === 'login' ? '🚀 Log In' : '🎉 Create Account'}</>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(0, 191, 166, 0.2)' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0, 191, 166, 0.2)' }} />
          </div>

          <motion.button
            onClick={handleGoogle}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-gray-700"
            style={{
              borderColor: 'rgba(0, 191, 166, 0.25)',
              background: 'rgba(0, 191, 166, 0.04)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {mode === 'login' && (
            <p className="text-center text-xs mt-4" style={{ color: '#94a3b8' }}>
              💡 Demo: Enter any email & password to explore
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
