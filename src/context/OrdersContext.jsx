import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OrdersContext = createContext();

export function sanitizeOrderItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const cleanItem = { ...item };

    // Strip Base64 data strings to prevent high database egress and storage bloat
    if (typeof cleanItem.image === 'string' && cleanItem.image.startsWith('data:image')) {
      delete cleanItem.image;
    }
    if (typeof cleanItem.designSnapshot === 'string' && cleanItem.designSnapshot.startsWith('data:image')) {
      delete cleanItem.designSnapshot;
    }

    if (cleanItem.customConfig && typeof cleanItem.customConfig === 'object') {
      const cleanCustom = { ...cleanItem.customConfig };
      if (typeof cleanCustom.designSnapshot === 'string' && cleanCustom.designSnapshot.startsWith('data:image')) {
        delete cleanCustom.designSnapshot;
      }
      cleanItem.customConfig = cleanCustom;
    }

    if (cleanItem.customDetails && typeof cleanItem.customDetails === 'object') {
      const cleanCustomDetails = { ...cleanItem.customDetails };
      if (typeof cleanCustomDetails.designSnapshot === 'string' && cleanCustomDetails.designSnapshot.startsWith('data:image')) {
        delete cleanCustomDetails.designSnapshot;
      }
      cleanItem.customDetails = cleanCustomDetails;
    }

    return cleanItem;
  });
}

function mapFromDb(ord) {
  if (!ord) return null;
  const ref = ord.ref || ord.id;
  return {
    id: ord.id || ref,
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

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    // Admin Session Check: Ensure user is authenticated admin before querying orders
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setOrders([]);
      setLoading(false);
      return [];
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || isAdmin !== true) {
      setOrders([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, ref, created_at, updated_at, status, customer, items, total, payment_method, payment_proof_path')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch orders from Supabase:', error.message);
        setOrders([]);
        return [];
      } else if (Array.isArray(data)) {
        const mapped = data.map(mapFromDb);
        setOrders(mapped);
        return mapped;
      }
    } catch (err) {
      console.error('Unexpected error loading orders:', err);
    } finally {
      setLoading(false);
    }
    return [];
  };

  useEffect(() => {
    // Only fetch orders if there is an active user session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchOrders();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchOrders();
      } else {
        setOrders([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.ref === orderId ? { ...ord, status: newStatus } : ord))
    );

    try {
      const { error: errId } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (errId) {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('ref', orderId);
      }
      return { success: true };
    } catch (err) {
      console.error('Supabase update order status error:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId && ord.ref !== orderId));
    try {
      const { error: errId } = await supabase.from('orders').delete().eq('id', orderId);
      if (errId) {
        await supabase.from('orders').delete().eq('ref', orderId);
      }
      return { success: true };
    } catch (err) {
      console.error('Supabase delete order error:', err);
      return { success: false, error: err.message };
    }
  };

  // Find order by code in local memory
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

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        updateOrderStatus,
        deleteOrder,
        getOrderByCode
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
