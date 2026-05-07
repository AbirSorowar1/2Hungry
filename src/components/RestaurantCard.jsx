import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

export default function RestaurantCard({ restaurant }) {
  const { isFav, toggle } = useFavorites();
  const navigate = useNavigate();
  const fav = isFav(restaurant.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer relative"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {restaurant.promo && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
            {restaurant.promo}
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); toggle(restaurant.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-125"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          {fav ? '❤️' : '🤍'}
        </button>

        <div className="absolute bottom-3 left-3 flex gap-1">
          {restaurant.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-white text-xs font-semibold backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(0, 191, 166, 0.1)' }}>
            {restaurant.logo}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              {restaurant.name}
            </h3>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {restaurant.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{restaurant.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({restaurant.reviews.toLocaleString()})</span>
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>🕒 {restaurant.delivery_time}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>৳{restaurant.deliveryFee} delivery</span>
        </div>
      </div>
    </motion.div>
  );
}