import React, { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();
const STORAGE_KEY = 'duat_orders';

// Demo initial orders so the admin dashboard has sample orders to manage right away
const INITIAL_ORDERS = [
  {
    id: 'DUAT-9482',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    status: 'shipped', // placed, forge, shipped, delivered
    customer: {
      fullName: 'أحمد محمود',
      phone: '01012345678',
      address: 'شارع التسعين الشمالي، التجمع الخامس',
      governorate: { nameAr: 'القاهرة', fee: 50 }
    },
    items: [
      { id: 'case-solar', nameAr: 'جراب الشمسي الشفاف', nameEn: 'Clear Solar Case', price: 720, quantity: 1 }
    ],
    total: 770,
    paymentMethod: 'cod'
  },
  {
    id: 'DUAT-7104',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    status: 'forge',
    customer: {
      fullName: 'مريم علي',
      phone: '01198765432',
      address: 'حي الجامعة، المنصورة',
      governorate: { nameAr: 'الدقهلية', fee: 65 }
    },
    items: [
      { id: 'case-gold-ring', nameAr: 'جراب حلقة الذهب التكتيكي', nameEn: 'Gold Ring Armor Case', price: 780, quantity: 1 },
      { id: 'charm-scarab', nameAr: 'تعليقة الجعران الذهبي', nameEn: 'Scarab Gold Charm', price: 290, quantity: 1 }
    ],
    total: 1135,
    paymentMethod: 'instapay'
  }
];

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
    }
    return INITIAL_ORDERS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  // Add a new order
  const addOrder = (orderData) => {
    const newOrder = {
      id: orderData.id || `DUAT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'placed',
      customer: orderData.customer || {},
      items: orderData.items || [],
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'cod'
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Update order status (placed, forge, shipped, delivered)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return ord;
      })
    );
  };

  // Delete an order
  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Find order by code (supports prefix matching e.g. "9482" or "DUAT-9482")
  const getOrderByCode = (code) => {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return orders.find(
      (ord) =>
        ord.id.toUpperCase() === cleanCode ||
        ord.id.replace('DUAT-', '').toUpperCase() === cleanCode
    );
  };

  // Reset to initial sample orders
  const resetOrders = () => {
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderByCode,
        resetOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
