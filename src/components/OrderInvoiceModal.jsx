import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SunDisc } from './SunDisc';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  const { lang, formatPrice } = useLanguage();
  const isAr = lang === 'ar';

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white print:static" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#14110F] text-[#F0EBE0] border border-[#2E2823] w-full max-w-2xl rounded-xl shadow-2xl relative p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Action Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-grave pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gold" size={20} />
            <h3 className="font-clash text-lg font-bold text-bone">
              {isAr ? 'فاتورة الطلب الرسمية' : 'Official Order Invoice'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary py-1.5 px-4 text-xs font-mono flex items-center gap-1.5 min-h-[36px]"
            >
              <Printer size={14} />
              <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-grave bg-stone hover:text-gold text-ash transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* INVOICE CONTENT CANVAS AREA */}
        <div className="space-y-6">
          
          {/* Header Brand & Invoice Ref */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-grave/60 print:border-black/20">
            <div className="flex items-center gap-3">
              <SunDisc size={36} variant="gold" />
              <div>
                <h1 className="font-clash text-2xl font-bold tracking-wider text-bone print:text-black">DUAT STORE</h1>
                <p className="font-mono text-[10px] text-ash uppercase tracking-widest print:text-gray-600">
                  {isAr ? 'استيكرات إيبوكسي مصنوعة يدويًا في مصر' : 'Hand-Crafted 3D Epoxy Stickers in Egypt'}
                </p>
              </div>
            </div>

            <div className="text-left rtl:text-right font-mono text-xs space-y-1">
              <div className="text-gold font-bold text-sm">
                {isAr ? 'رقم الطلب:' : 'Order Ref:'} <span className="font-mono">{order.ref || order.id}</span>
              </div>
              <div className="text-ash text-[11px] print:text-gray-600">
                {isAr ? 'تاريخ التحرير:' : 'Date:'} {new Date(order.created_at || Date.now()).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
              </div>
              <div className="inline-block px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] uppercase rounded">
                {order.status || 'placed'}
              </div>
            </div>
          </div>

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone/50 border border-grave/50 rounded-lg print:bg-gray-50 print:border-gray-300">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-ash uppercase block print:text-gray-500">
                {isAr ? 'بيانات العميل' : 'Customer Info'}
              </span>
              <p className="font-clash font-bold text-sm text-bone print:text-black">
                {customer.fullName || customer.name || 'عميل دوات'}
              </p>
              <p className="font-mono text-xs text-ash print:text-gray-700">
                {customer.phone || customer.phoneNumber || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-ash uppercase block print:text-gray-500">
                {isAr ? 'عنوان التوصيل' : 'Shipping Address'}
              </span>
              <p className="font-mono text-xs text-bone print:text-black">
                {customer.address || '-'}
              </p>
              <p className="font-mono text-xs text-ash print:text-gray-700">
                {customer.governorate?.nameAr || customer.governorate || 'مصر'}
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-ash uppercase tracking-wider block">
              {isAr ? 'المنتجات المطلوبة' : 'Order Items'}
            </span>

            <div className="border border-grave rounded-lg overflow-hidden print:border-gray-300">
              <table className="w-full text-xs font-mono text-left rtl:text-right">
                <thead className="bg-stone text-ash uppercase text-[10px] border-b border-grave print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="p-3">{isAr ? 'المنتج' : 'Item'}</th>
                    <th className="p-3 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                    <th className="p-3 text-right rtl:text-left">{isAr ? 'السعر' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grave/50 print:divide-gray-200">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-coal/40">
                      <td className="p-3">
                        <span className="font-bold text-bone print:text-black">
                          {isAr ? (item.nameAr || item.nameEn) : (item.nameEn || item.nameAr)}
                        </span>
                        {item.tagEn && (
                          <span className="block text-[10px] text-ash print:text-gray-500">
                            {item.tagEn}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-bone print:text-black">{item.quantity || 1}</td>
                      <td className="p-3 text-right rtl:text-left font-bold text-gold print:text-black">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col items-end space-y-1.5 pt-4 border-t border-grave/60 font-mono text-xs print:border-gray-300">
            <div className="flex justify-between w-full max-w-xs text-ash print:text-gray-600">
              <span>{isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
              <span>{customer.governorate?.fee ? formatPrice(customer.governorate.fee) : 'مجاناً'}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-bone font-bold text-sm pt-2 border-t border-grave/40 print:text-black">
              <span>{isAr ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
              <span className="text-gold print:text-black">{formatPrice(order.total || order.totalPrice || 0)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center font-mono text-[10px] text-ash/70 print:text-gray-500 border-t border-grave/40">
            <p>{isAr ? 'شكراً لثقتكم بـ DUAT — تم إصدار هذه الفاتورة إلكترونياً.' : 'Thank you for choosing DUAT — Official Electronic Invoice.'}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
