import { motion } from 'framer-motion';
import { useOrders } from '../context/OrdersContext';
import { Link } from 'react-router-dom';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', emoji: '✅', desc: 'Your order has been received' },
  { key: 'cooking', label: 'Cooking', emoji: '👨‍🍳', desc: 'Chef is preparing your food' },
  { key: 'on_the_way', label: 'On the Way', emoji: '🚴', desc: 'Rider is heading your way' },
  { key: 'delivered', label: 'Delivered', emoji: '🎉', desc: 'Enjoy your meal!' },
];

function getStepIndex(status) {
  return STATUS_STEPS.findIndex(s => s.key === status);
}

function OrderCard({ order }) {
  const stepIdx = getStepIndex(order.status);
  const placed = new Date(order.placedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl space-y-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {order.id}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {placed.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
            {placed.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-xl" style={{ color: '#00BFA6' }}>৳{order.total}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {order.items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-2xl flex-shrink-0"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              {item.name} ×{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Tracking progress */}
      <div>
        <p className="text-xs font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
          ORDER TRACKING
        </p>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 rounded-full"
            style={{ background: 'var(--border)' }} />
          <motion.div
            className="absolute top-5 left-5 h-0.5 rounded-full"
            style={{ background: '#00BFA6' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 relative"
                    style={{
                      background: done || active ? '#00BFA6' : 'var(--surface)',
                      border: `2px solid ${done || active ? '#00BFA6' : 'var(--border)'}`,
                      boxShadow: active ? '0 0 20px rgba(0, 191, 166, 0.5)' : 'none',
                    }}
                    animate={active ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {done || active ? step.emoji : (
                      <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border)' }} />
                    )}
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xs font-semibold"
                      style={{ color: done || active ? '#00BFA6' : 'var(--text-muted)' }}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current status desc */}
        <div className="mt-4 p-3 rounded-2xl flex items-center gap-3"
          style={{ background: 'rgba(0, 191, 166, 0.08)', border: '1px solid rgba(0, 191, 166, 0.2)' }}>
          <span className="text-xl">{STATUS_STEPS[stepIdx]?.emoji}</span>
          <p className="text-sm font-medium" style={{ color: '#00BFA6' }}>
            {STATUS_STEPS[stepIdx]?.desc}
          </p>
          {order.status !== 'delivered' && (
            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
              Est. {new Date(order.estimatedDelivery).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Delivery address */}
      {order.address && (
        <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <span>📍</span> {order.address}
        </p>
      )}
    </motion.div>
  );
}

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(0, 191, 166, 0.12)' }}>
          📦
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>My Orders</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{orders.length} orders total</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-7xl">🛵</div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            No orders yet!
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Your order history will appear here</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-4">
            🍔 Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
