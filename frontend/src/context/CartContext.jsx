import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // item = { product: {_id, name, price, unit, stock, category}, qty }
  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product._id === product._id);
      if (found) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, product, qty: Math.min(i.qty + qty, product.stock) }
            : i
        );
      }
      return [...prev, { product, qty: Math.min(qty, product.stock) }];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === id
          ? { ...i, qty: Math.max(1, Math.min(qty, i.product.stock)) }
          : i
      )
    );

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i.product._id !== id));

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const itemsPrice = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, count, itemsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
