import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { promos } from '../data/mockData';

export default function CartDrawer() {
  const { items, isOpen, dispatch, subtotal, deliveryFee, discount, total, appliedPromo, itemCount } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [address, setAddress] = useState('123 Gulshan Ave, Dhaka');
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const applyPromo = () => {
    const found = promos.find(p => p.code.toLowerCase() === promoInput.trim().toLowerCase());
    if (!found) { toast.error('Invalid promo code'); return; }
    if (subtotal < found.minOrder) { toast.error(`Min order ৳${found.minOrder} required`); return; }
    dispatch({ type: 'APPLY_PROMO', promo: found });
    toast.success(`🎉 Promo "${found.code}" applied!`);
    setPromoInput('');
  };

  const handleOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1500));
    placeOrder([...items], total, address, appliedPromo);
    dispatch({ type: 'CLEAR' });
    setPlacing(false);
    setOrdered(true);
    setTimeout(() => {
      setOrdered(false);
      dispatch({ type: 'CLOSE_CART' });
      navigate('/orders');
    }, 2500);
  };

  const goToOrders = () => {
    dispatch({ type: 'CLOSE_CART' });
    navigate('/orders');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col shadow-2xl"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'rgba(0, 191, 166, 0.12)' }}>
                  🛒
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Your Cart
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
                style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <AnimatePresence>
              {ordered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4 p-8"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-7xl"
                  >🎉</motion.div>
                  <h3 className="font-display text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                    Order Placed!
                  </h3>
                  <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Your food is being prepared 🍳<br />Estimated delivery: 30-45 min
                  </p>
                  <button onClick={goToOrders} className="btn-primary mt-2">
                    Track Order 🚴
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!ordered && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                      <div className="text-6xl opacity-30">🍽️</div>
                      <p className="font-display text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>
                        Cart is empty
                      </p>
                      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                        Explore restaurants and add<br />something delicious!
                      </p>
                      <button
                        onClick={() => dispatch({ type: 'CLOSE_CART' })}
                        className="btn-primary text-sm px-6 py-2.5"
                      >
                        Browse Food 🍔
                      </button>
                    </div>
                  ) : (
                    <>
                      {items.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 p-3 rounded-2xl"
                          style={{ background: 'var(--bg-secondary, #f8fffe)' }}
                        >
                          <img src={item.image} alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {item.name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {item.restaurantName}
                            </p>
                            <p className="font-bold text-sm mt-1" style={{ color: '#00BFA6' }}>
                              ৳{item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.quantity - 1 })}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110"
                              style={{ background: 'var(--border)', color: 'var(--text-primary)' }}
                            >−</button>
                            <span className="w-5 text-center font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.quantity + 1 })}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110"
                              style={{ background: '#00BFA6', color: 'white' }}
                            >+</button>
                          </div>
                        </motion.div>
                      ))}

                      <div className="p-3 rounded-2xl" style={{ background: 'var(--bg-secondary, #f8fffe)' }}>
                        <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-muted)' }}>
                          📍 Delivery Address
                        </label>
                        <input
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="input-field text-sm"
                          placeholder="Enter delivery address"
                        />
                      </div>

                      <div className="p-3 rounded-2xl" style={{ background: 'var(--bg-secondary, #f8fffe)' }}>
                        <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-muted)' }}>
                          🎁 Promo Code
                        </label>
                        {appliedPromo ? (
                          <div className="flex items-center justify-between p-2 rounded-xl"
                            style={{ background: 'rgba(0, 191, 166, 0.1)', border: '1px solid rgba(0, 191, 166, 0.3)' }}>
                            <span className="text-sm font-semibold" style={{ color: '#00BFA6' }}>
                              ✅ {appliedPromo.code} applied
                            </span>
                            <button
                              onClick={() => dispatch({ type: 'REMOVE_PROMO' })}
                              className="text-xs" style={{ color: '#ef4444' }}
                            >Remove</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              value={promoInput}
                              onChange={e => setPromoInput(e.target.value.toUpperCase())}
                              onKeyDown={e => e.key === 'Enter' && applyPromo()}
                              placeholder="Try: HUNGRY20"
                              className="input-field text-sm flex-1"
                            />
                            <button onClick={applyPromo} className="btn-primary text-sm px-4 py-2.5 whitespace-nowrap">
                              Apply
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="px-4 py-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="space-y-2">
                      {[
                        { label: 'Subtotal', value: `৳${subtotal}` },
                        { label: 'Delivery', value: `৳${deliveryFee}` },
                        discount > 0 ? { label: 'Discount', value: `-৳${discount}`, tiya: true } : null,
                      ].filter(Boolean).map((row, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                          <span style={{ color: row.tiya ? '#00BFA6' : 'var(--text-primary)', fontWeight: row.tiya ? 600 : 400 }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-display font-bold text-lg pt-2"
                        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                        <span>Total</span>
                        <span style={{ color: '#00BFA6' }}>৳{total}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleOrder}
                      disabled={placing}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
                    >
                      {placing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>🚀 Place Order · ৳{total}</>
                      )}
                    </motion.button>
                    <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      By ordering, you agree to our Terms of Service
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}