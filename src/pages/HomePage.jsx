import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import { FoodCardSkeleton, RestaurantCardSkeleton } from '../components/SkeletonCard';
import { foodItems, restaurants, categories, promos } from '../data/mockData';

const typingTexts = [
  'Burger Republic 🍔',
  'Pizza Paradiso 🍕',
  'Sushi Sakura 🍣',
  'Noodle House 🍜',
  'Taco Fiesta 🌮',
];

function TypingText() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const current = typingTexts[idx];
    const timer = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setPaused(true);
          setTimeout(() => { setPaused(false); setDeleting(true); }, 1800);
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx(prev => (prev + 1) % typingTexts.length);
        }
      }
    }, deleting ? 50 : 80);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, paused]);

  return (
    <span style={{ color: '#00BFA6' }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-7 md:h-9 ml-1 align-middle rounded-full"
        style={{ background: '#00BFA6' }}
      />
    </span>
  );
}

const floatingItems = [
  { emoji: '🍔', x: '8%', y: '20%', delay: 0 },
  { emoji: '🍕', x: '88%', y: '15%', delay: 1 },
  { emoji: '🍜', x: '5%', y: '60%', delay: 2 },
  { emoji: '🌮', x: '90%', y: '55%', delay: 0.5 },
  { emoji: '🍣', x: '80%', y: '80%', delay: 1.5 },
  { emoji: '🥗', x: '12%', y: '80%', delay: 3 },
  { emoji: '🍟', x: '50%', y: '8%', delay: 2.5 },
  { emoji: '🥤', x: '45%', y: '88%', delay: 1.2 },
];

export default function HomePage() {
  const { user } = useAuth();
  const { dispatch } = useCart();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCity, setActiveCity] = useState('all');
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); setShowResults(false); return; }
    const q = search.toLowerCase();
    const results = [
      ...foodItems.filter(f =>
        f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) ||
        f.restaurantName.toLowerCase().includes(q)
      ).slice(0, 4).map(f => ({ ...f, type: 'food' })),
      ...restaurants.filter(r =>
        r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      ).slice(0, 2).map(r => ({ ...r, type: 'restaurant' })),
    ];
    setSearchResults(results);
    setShowResults(true);
  }, [search]);

  const filteredFoods = foodItems.filter(f => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'burgers') return f.category.toLowerCase().includes('burger');
    if (activeCategory === 'pizza') return f.category.toLowerCase().includes('pizza');
    if (activeCategory === 'sushi') return f.category.toLowerCase().includes('sushi') || f.category.toLowerCase().includes('sashimi') || f.category.toLowerCase().includes('roll');
    if (activeCategory === 'noodles') return f.category.toLowerCase().includes('noodle') || f.category.toLowerCase().includes('ramen');
    if (activeCategory === 'tacos') return f.category.toLowerCase().includes('taco') || f.category.toLowerCase().includes('bowl') || f.restaurantId === 'r4';
    if (activeCategory === 'healthy') return f.tags?.includes('Vegan') || f.tags?.includes('Healthy') || f.restaurantId === 'r6';
    return true;
  });

  const filteredRestaurants = restaurants.filter(r => {
    const cityMatch = activeCity === 'all' || r.city.toLowerCase() === activeCity.toLowerCase();
    const categoryMatch = activeCategory === 'all' || r.category.toLowerCase().includes(activeCategory.toLowerCase());
    return cityMatch && categoryMatch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 191, 166, 0.06) 0%, transparent 70%)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 191, 166, 0.3), transparent)' }} />
        </div>

        {/* Floating foods */}
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl md:text-5xl pointer-events-none select-none hidden md:block"
            style={{ left: item.x, top: item.y }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5 + i * 0.5, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(0, 191, 166, 0.1)', color: '#00BFA6', border: '1px solid rgba(0, 191, 166, 0.2)' }}
            >
              <span>👋</span>
              Hey {user?.displayName?.split(' ')[0] || 'there'}, what are you craving?
            </motion.div>

            {/* Heading */}
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Too Hungry?
              <br />
              Order <TypingText /> Instantly 😋
            </h1>

            <p className="text-base md:text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
              30 min delivery · Real-time tracking
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto" ref={searchRef}>
              <div className="relative search-glow rounded-2xl transition-all duration-300"
                style={{ border: '2px solid rgba(0, 191, 166, 0.25)', background: 'var(--surface)' }}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search for food, restaurants..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search && setShowResults(true)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm font-medium rounded-2xl"
                  style={{ color: 'var(--text-primary)' }}
                />
                {search && (
                  <button onClick={() => { setSearch(''); setShowResults(false); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                    ✕
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 left-0 right-0 rounded-2xl shadow-xl overflow-hidden z-20"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    {searchResults.map((item, i) => (
                      <motion.a
                        key={item.id}
                        href={item.type === 'food' ? `/food/${item.id}` : `/restaurant/${item.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-tiya-50 dark:hover:bg-tiya-900/20 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <img src={item.image || item.banner} alt=""
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {item.type === 'food' ? `৳${item.price} · ${item.restaurantName}` : item.cuisine}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(0, 191, 166, 0.1)', color: '#00BFA6' }}>
                          {item.type === 'food' ? '🍽️ Food' : '🏪 Restaurant'}
                        </span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['🍔 Burgers', '🍕 Pizza', '🍜 Ramen', '🌮 Tacos', '🥗 Healthy'].map(tag => (
                <button key={tag}
                  onClick={() => setSearch(tag.split(' ')[1])}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(0, 191, 166, 0.1)', color: '#00BFA6', border: '1px solid rgba(0, 191, 166, 0.2)' }}>
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 pb-20">

        {/* Promos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-5 rounded-3xl relative overflow-hidden cursor-pointer group"
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg, #00BFA6 0%, #007a6a 100%)'
                    : i === 1
                    ? 'linear-gradient(135deg, #0a3d35 0%, #00BFA6 100%)'
                    : 'linear-gradient(135deg, #005c50 0%, #00a892 100%)',
                }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="absolute top-3 right-3 text-3xl opacity-30 group-hover:opacity-50 transition-opacity">🎁</div>
                <span className="font-display font-bold text-2xl text-white">
                  {promo.type === 'percent' ? `${promo.discount}% OFF` : `৳${promo.discount} OFF`}
                </span>
                <p className="text-white/80 text-sm mt-1">{promo.description}</p>
                <div className="mt-3 px-3 py-1.5 rounded-xl w-fit"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <code className="text-white text-xs font-bold tracking-wider">{promo.code}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories */}
        <section>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-sm font-semibold transition-all duration-200 flex-shrink-0"
                style={{
                  background: activeCategory === cat.id ? '#00BFA6' : 'var(--surface)',
                  color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'var(--border)'}`,
                  boxShadow: activeCategory === cat.id ? '0 4px 16px rgba(0, 191, 166, 0.35)' : 'var(--shadow-card)',
                }}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Main content */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">🍽️ Food</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {filteredFoods.length} results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)
              : filteredFoods.map(item => <FoodCard key={item.id} item={item} />)
            }
          </div>
        </section>

      </div>

      {/* Backdrop for search */}
      {showResults && (
        <div className="fixed inset-0 z-10" onClick={() => setShowResults(false)} />
      )}
    </div>
  );
}
