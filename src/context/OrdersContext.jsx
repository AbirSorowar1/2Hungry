import { createContext, useContext, useState, useEffect } from 'react';
import { ref, push, update, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  // Listen to orders from Firebase for current user
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const ordersRef = ref(db, 'orders');
    const ordersQuery = query(ordersRef, orderByChild('userId'), equalTo(user.uid));

    const unsubscribe = onValue(ordersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ordersList = Object.keys(data).map(key => ({
          ...data[key],
          firebaseId: key
        }));
        // Sort by date descending
        setOrders(ordersList.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const placeOrder = async (items, total, address, promo) => {
    if (!user) return null;

    const newOrder = {
      id: 'ORD-' + Date.now(),
      userId: user.uid,
      userEmail: user.email,
      items,
      total,
      address,
      promo,
      status: 'placed',
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    };

    try {
      // Push to Firebase
      const ordersRef = ref(db, 'orders');
      const newOrderRef = await push(ordersRef, newOrder);
      
      // Simulate order progression
      setTimeout(() => updateStatus(newOrderRef.key, 'cooking'), 5000);
      setTimeout(() => updateStatus(newOrderRef.key, 'on_the_way'), 15000);
      setTimeout(() => updateStatus(newOrderRef.key, 'delivered'), 30000);

      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    }
  };

  const updateStatus = async (firebaseId, status) => {
    try {
      const orderRef = ref(db, `orders/${firebaseId}`);
      await update(orderRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be inside OrdersProvider');
  return ctx;
};
