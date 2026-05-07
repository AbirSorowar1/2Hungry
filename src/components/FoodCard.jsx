import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import toast from 'react-hot-toast';

export default function FoodCard({ item }) {
  const { dispatch } = useCart();
  const { isFav, toggle } = useFavorites();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', item });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
    toast.success(`${item.name} added! 🛒`, { duration: 1500 });
  };

  const fav = isFav(item.id);
  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer relative"
      onClick={() => navigate(`/food/${item.id}`)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {discount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
            -{discount}%
          </div>
        )}

        {item.tags?.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-lg text-white text-xs font-semibold backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.45)' }}>
              {item.tags[0]}
            </span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-125"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-base leading-tight line-clamp-1"
          style={{ color: 'var(--text-primary)' }}>
          {item.name}
        </h3>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {item.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(item.rating))}</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {item.rating}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({item.reviews})</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {item.prepTime}min</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg" style={{ color: '#00BFA6' }}>
              ৳{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
                ৳{item.originalPrice}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.85 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200"
            style={{
              background: added ? 'rgba(0, 191, 166, 0.2)' : 'rgba(0, 191, 166, 0.12)',
              color: '#00BFA6',
              boxShadow: added ? '0 0 20px rgba(0, 191, 166, 0.5)' : 'none',
            }}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
              ) : (
                <motion.span key="plus">+</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}