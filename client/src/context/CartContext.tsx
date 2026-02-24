import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  couponCode: string;
  couponError: string;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
}

const COUPONS: Record<string, number> = {
  WELCOME50: 0.5,
  CAFE10: 0.1,
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cafe_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  useEffect(() => {
    localStorage.setItem('cafe_cart', JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountRate(0);
    setCouponError('');
  };

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper] !== undefined) {
      setCouponCode(upper);
      setDiscountRate(COUPONS[upper]);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponCode('');
      setDiscountRate(0);
    }
  };

  return (
    <CartContext.Provider value={{ items, couponCode, couponError, subtotal, discount, total, addItem, removeItem, updateQuantity, clearCart, applyCoupon }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
