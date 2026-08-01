import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OrdersContext = createContext();

function mapFromDb(ord) {
  if (!ord) return null;
  const ref = ord.ref || ord.id;
  return {
    id: ref,
    ref: ref,
    createdAt: ord.created_at || new Date().toISOString(),
    updatedAt: ord.updated_at,
    status: ord.status || 'placed',
    customer: ord.customer || {},
    items: Array.isArray(ord.items) ? ord.items : [],
    total: Number(ord.total) || 0,
    paymentMethod: ord.payment_method || ord.paymentMethod || 'cod',
    payment_proof_path: ord.payment_proof_path || null,
    paymentProofPath: ord.payment_proof_path || null
  };
}

function mapToDb(ord) {
  const refCode = ord.ref || ord.id || `DUAT-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    ref: refCode,
    status: ord.status || 'placed',
    customer: ord.customer || {},
    items: Array.isArray(ord.items) ? ord.items : [],
    total: Number(ord.total) || 0,
    payment_method: ord.paymentMethod || ord.payment_method || 'cod',
    payment_proof_path: ord.payment_proof_path || ord.paymentProofPath || null
  };
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to fetch orders from Supabase (may be unauthenticated):', error);
        setOrders([]);
      } else if (Array.isArray(data)) {
        setOrders(data.map(mapFromDb));
      }
    } catch (err) {
      console.error('Unexpected error loading orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add a new order
  const addOrder = async (orderData) => {
    const refCode = orderData.ref || orderData.id || `DUAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: refCode,
      ref: refCode,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'placed',
      customer: orderData.customer || {},
      items: orderData.items || [],
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || orderData.payment_method || 'cod'
    };

    setOrders((prev) => [newOrder, ...prev]);

    try {
      const dbPayload = mapToDb(newOrder);
      const { error } = await supabase.from('orders').insert(dbPayload);
      if (error) {
        console.error('Supabase add order error:', error);
      }
    } catch (err) {
      console.error('Supabase add order error:', err);
    }

    return newOrder;
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.ref === orderId ? { ...ord, status: newStatus } : ord))
    );

    try {
      const { error: errRef } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('ref', orderId);
      if (errRef) {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      }
    } catch (err) {
      console.error('Supabase update order status error:', err);
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId && ord.ref !== orderId));
    try {
      const { error: errRef } = await supabase.from('orders').delete().eq('ref', orderId);
      if (errRef) {
        await supabase.from('orders').delete().eq('id', orderId);
      }
    } catch (err) {
      console.error('Supabase delete order error:', err);
    }
  };

  // Find order by code
  const getOrderByCode = (code) => {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return orders.find(
      (ord) =>
        (ord.id && ord.id.toUpperCase() === cleanCode) ||
        (ord.ref && ord.ref.toUpperCase() === cleanCode) ||
        (ord.id && ord.id.replace('DUAT-', '').toUpperCase() === cleanCode)
    );
  };

  const resetOrders = () => {
    fetchOrders();
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
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
