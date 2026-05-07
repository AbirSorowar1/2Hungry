import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { foodItems, foodItems as allItems } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import FoodCard from '../components/FoodCard';
import toast from 'react-hot-toast';

const reviews = [
  { id: 1, name: 'Rahul M.', avatar: '👨', rating: 5, comment: 'Absolutely incredible! The flavors were perfect and delivery was fast.', emoji: '🔥', time: '2 hours ago' },
  { id: 2, name: 'Priya S.', avatar: '👩', rating: 4, comment: 'Really tasty! Would have been 5 stars but the portion was a bit small.', emoji: '😋', time: '1 day ago' },
  { id: 3, name: 'Ahmad K.', avatar: '🧑', rating: 5, comment: 'Best I have had in ages. Will definitely order again!', emoji: '❤️', time: '2 days ago' },
];

export default function FoodDetailPage() {
  const { id } = useParams();
  const item = allItems.find(f => f.id === id);
  const { dispatch } = useCart();
  const { isFav, toggle } = useFavorites();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const [activeReview, setActiveReview] = useState(null);

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">😢</div>
      <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Item not found</h2>
      <Link to="/" className="btn-primary">← Go Back</Link>
    </div>
  );

  const related = allItems.filter(f => f.restaurantId === item.restaurantId && f.id !== item.id).slice(0, 4);
  const fav = isFav(item.id);
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_ITEM', item });
    }
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1000);
    toast.success(`${qty}x ${item.name} added! 🛒`);
    dispatch({ type: 'OPEN_CART' });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:text-tiya-500 transition-colors">Home</Link>
          <span>›</span>
          <Link to={`/restaurant/${item.restaurantId}`} className="hover:text-tiya-500 transition-colors">
            {item.restaurantName}
          </Link>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden aspect-square">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            {discount && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #00BFA6, #00a892)' }}>
                -{discount}% OFF
              </div>
            )}
            <button
              onClick={() => toggle(item.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all hover:scale-125"
              style={{ background: 'rgba(255,255,255,0.9)' }}
            >
              {fav ? '❤️' : '🤍'}
            </button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags?.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
                <span className="tag">🕒 {item.prepTime} min</span>
                <span className="tag">🔥 {item.calories} cal</span>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl mb-3"
                style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </h1>

              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-lg ${s <= Math.round(item.rating) ? 'star-filled' : 'star-empty'}`}>★</span>
                  ))}
                </div>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({item.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display font-bold text-4xl" style={{ color: '#00BFA6' }}>
                  ৳{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-lg line-through" style={{ color: 'var(--text-muted)' }}>
                    ৳{item.originalPrice}
                  </span>
                )}
              </div>

              {/* Qty selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                <div className="flex items-center gap-3 p-1 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all hover:scale-110"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>−</button>
                  <span className="w-8 text-center font-display font-bold text-lg"
                    style={{ color: 'var(--text-primary)' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all hover:scale-110"
                    style={{ background: '#00BFA6', color: 'white' }}>+</button>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary py-4 text-base flex items-center justify-center gap-3"
              style={{
                background: addedAnim
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #00BFA6, #00a892)',
              }}
            >
              {addedAnim ? (
                <>✓ Added to Cart!</>
              ) : (
                <>🛒 Add to Cart · ৳{item.price * qty}</>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="section-title mb-6">Reviews & Reactions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-5 rounded-3xl space-y-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{review.avatar}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{review.time}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{review.emoji}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= review.rating ? 'star-filled' : 'star-empty'}`}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Related items */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">More from {item.restaurantName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(r => <FoodCard key={r.id} item={r} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
