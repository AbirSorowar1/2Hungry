import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { foodItems, restaurants } from '../data/mockData';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { favorites } = useFavorites();
  const { items: cartItems } = useCart();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const favFoods = foodItems.filter(f => favorites.includes(f.id));
  const favRestaurants = restaurants.filter(r => favorites.includes(r.id));
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const handleLogout = async () => {
    await logout();
    toast.success('See you next time! 👋');
    navigate('/login');
  };

  const stats = [
    { icon: '📦', label: 'Total Orders', value: orders.length },
    { icon: '✅', label: 'Delivered', value: deliveredOrders },
    { icon: '💰', label: 'Total Spent', value: `৳${totalSpent.toLocaleString()}` },
    { icon: '❤️', label: 'Favorites', value: favorites.length },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00BFA6 0%, #005c50 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white overflow-hidden flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)' }}>
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              : (user?.displayName?.[0] || user?.email?.[0] || '?').toUpperCase()
            }
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
              {user?.displayName || 'Foodie'}
            </h1>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.25)' }}>
                🍔 Hungry Member
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-3xl text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-xl" style={{ color: '#00BFA6' }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {[
            { id: 'overview', label: '⚙️ Settings' },
            { id: 'activity', label: '📊 Activity' },
            { id: 'favorites', label: '❤️ Favorites' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? '#00BFA6' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {[
              { icon: '🌙', label: 'Dark Mode', action: toggle, toggle: true, value: isDark },
              { icon: '📦', label: 'My Orders', action: () => navigate('/orders') },
              { icon: '❤️', label: 'Favorites', action: () => setActiveTab('favorites') },
              { icon: '📍', label: 'Delivery Addresses', action: () => toast('Coming soon! 🚀') },
              { icon: '💳', label: 'Payment Methods', action: () => toast('Coming soon! 🚀') },
              { icon: '🔔', label: 'Notifications', action: () => toast('Coming soon! 🚀') },
              { icon: '🆘', label: 'Help & Support', action: () => toast('Coming soon! 🚀') },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:scale-[1.01] text-left"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                </div>
                {item.toggle ? (
                  <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${item.value ? 'bg-tiya-500' : ''}`}
                    style={{ background: item.value ? '#00BFA6' : 'var(--border)' }}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${item.value ? 'left-7' : 'left-1'}`} />
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>›</span>
                )}
              </motion.button>
            ))}

            <motion.button
              onClick={handleLogout}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all hover:scale-[1.01] mt-4"
              style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444' }}
            >
              <span className="text-xl">🚪</span>
              <span className="font-semibold text-sm">Log Out</span>
            </motion.button>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Current Cart */}
            {cartItems.length > 0 && (
              <div>
                <h3 className="section-title mb-4">🛒 Current Cart ({cartItems.length} items)</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.restaurantName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: '#00BFA6' }}>৳{item.price * item.quantity}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/')} className="btn-primary w-full mt-4">Continue Shopping</button>
              </div>
            )}

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div>
                <h3 className="section-title mb-4">📦 Recent Orders ({orders.length})</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-4 rounded-2xl"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'on_the_way' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'cooking' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                        {order.items.length} items · ৳{order.total} · {new Date(order.placedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        {order.items.slice(0, 3).map(item => (
                          <img key={item.id} src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/orders" className="btn-secondary w-full mt-4 inline-block text-center">View All Orders</Link>
              </div>
            )}

            {cartItems.length === 0 && orders.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl">📊</div>
                <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  No activity yet
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>Start ordering to see your activity here</p>
                <Link to="/" className="btn-primary inline-block mt-2">Browse Food</Link>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {favFoods.length === 0 && favRestaurants.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl">💔</div>
                <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  No favorites yet
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>Tap the ❤️ on food cards to save favorites</p>
                <Link to="/" className="btn-primary inline-block mt-2">Browse Food</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {favFoods.length > 0 && (
                  <div>
                    <h3 className="section-title mb-4">Favorite Foods ({favFoods.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favFoods.map(f => (
                        <Link key={f.id} to={`/food/${f.id}`}
                          className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <img src={f.image} alt={f.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.restaurantName}</p>
                            <p className="font-bold text-sm mt-0.5" style={{ color: '#00BFA6' }}>৳{f.price}</p>
                          </div>
                          <span className="ml-auto text-lg">❤️</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {favRestaurants.length > 0 && (
                  <div>
                    <h3 className="section-title mb-4">Favorite Restaurants ({favRestaurants.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favRestaurants.map(r => (
                        <Link key={r.id} to={`/restaurant/${r.id}`}
                          className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: 'rgba(0, 191, 166, 0.1)' }}>{r.logo}</div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{r.cuisine}</p>
                          </div>
                          <span className="ml-auto text-lg">❤️</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
