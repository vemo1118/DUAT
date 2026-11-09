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
    subtotal: ord.subtotal == null ? null : Number(ord.subtotal),
    shippingFee: ord.shipping_fee == null ? null : Number(ord.shipping_fee),
    discount: Number(ord.discount) || 0,
    couponCode: ord.coupon_code || null,
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
        .select('id, ref, created_at, updated_at, status, customer, items, total, subtotal, shipping_fee, discount, coupon_code, payment_method, payment_proof_path')
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

  // Commit to the server before reporting success or changing local state.
  const updateOrderStatus = async (orderId, newStatus) => {
    const current = orders.find(ord => ord.id === orderId || ord.ref === orderId);
    if (!current) return { success: false, error: 'الطلب غير موجود.' };
    const { data, error } = await supabase.from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', current.id).select('id, status, updated_at').single();
    if (error || !data) return { success: false, error: 'تعذر حفظ حالة الطلب.' };
    setOrders(prev => prev.map(ord => ord.id === data.id ? { ...ord, status: data.status, updatedAt: data.updated_at } : ord));
    return { success: true };
  };

  const deleteOrder = async orderId => {
    const current = orders.find(ord => ord.id === orderId || ord.ref === orderId);
    if (!current) return { success: false, error: 'الطلب غير موجود.' };
    const { data, error } = await supabase.from('orders').delete().eq('id', current.id).select('id').single();
    if (error || !data) return { success: false, error: 'تعذر حذف الطلب.' };
    setOrders(prev => prev.filter(ord => ord.id !== data.id));
    return { success: true };
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
