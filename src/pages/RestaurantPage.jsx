import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { restaurants, foodItems } from '../data/mockData';
import FoodCard from '../components/FoodCard';
import { useFavorites } from '../context/FavoritesContext';

export default function RestaurantPage() {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === id);
  const { isFav, toggle } = useFavorites();
  const [activeCategory, setActiveCategory] = useState('all');

  if (!restaurant) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">😢</div>
      <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Restaurant not found</h2>
      <Link to="/" className="btn-primary">← Go Back</Link>
    </div>
  );

  const items = foodItems.filter(f => f.restaurantId === id);
  const itemCategories = ['all', ...new Set(items.map(f => f.category))];
  const filtered = activeCategory === 'all' ? items : items.filter(f => f.category === activeCategory);
  const fav = isFav(restaurant.id);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <img src={restaurant.banner} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back */}
        <Link to="/" className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          ←
        </Link>

        {/* Fav */}
        <button onClick={() => toggle(restaurant.id)}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          {fav ? '❤️' : '🤍'}
        </button>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.95)' }}>
              {restaurant.logo}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white">{restaurant.name}</h1>
              <p className="text-white/80 text-sm">{restaurant.cuisine}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 items-center p-4 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {[
            { icon: '⭐', value: `${restaurant.rating} (${restaurant.reviews.toLocaleString()})`, label: 'Rating' },
            { icon: '🕒', value: `${restaurant.deliveryTime} min`, label: 'Delivery time' },
            { icon: '🚴', value: `৳${restaurant.deliveryFee}`, label: 'Delivery fee' },
            { icon: '📦', value: `৳${restaurant.minOrder}`, label: 'Min. order' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-lg">{stat.icon}</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
              <div className="w-px h-6 ml-2 hidden md:block" style={{ background: 'var(--border)' }} />
            </div>
          ))}
          {restaurant.promo && (
            <div className="ml-auto px-3 py-1.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
              🎉 {restaurant.promo}
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <h2 className="section-title mb-6">Menu</h2>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
          {itemCategories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-semibold capitalize transition-all duration-200 flex-shrink-0"
              style={{
                background: activeCategory === cat ? '#00BFA6' : 'var(--surface)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--border)'}`,
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => <FoodCard key={item.id} item={item} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <p style={{ color: 'var(--text-muted)' }}>No items in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
