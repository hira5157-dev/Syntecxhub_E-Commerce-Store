// Keep these in sync with backend/controllers/orderController.js
export const FREE_DELIVERY_ABOVE = 2000;
export const DELIVERY_FEE = 150;

export const calcDelivery = (itemsPrice) =>
  itemsPrice === 0 || itemsPrice >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
