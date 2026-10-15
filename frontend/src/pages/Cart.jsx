import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calcDelivery, FREE_DELIVERY_ABOVE } from '../utils/pricing.js';

export default function Cart() {
  const { items, updateQty, removeFromCart, itemsPrice } = useCart();
  const navigate = useNavigate();
  const delivery = calcDelivery(itemsPrice);

  if (items.length === 0) {
    return (
      <div className="center-text">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn inline-btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <>
      <h2>Your cart</h2>
      <div className="two-col">
        <div className="list">
          {items.map(({ product, qty }) => (
            <div className="row-card" key={product._id}>
              <div className="row-info">
                <div className="card-title">{product.name}</div>
                <div className="muted">Rs. {product.price} / {product.unit}</div>
              </div>
              <div className="qty">
                <button className="qty-btn" onClick={() => updateQty(product._id, qty - 1)} disabled={qty <= 1}>-</button>
                <span>{qty}</span>
                <button className="qty-btn" onClick={() => updateQty(product._id, qty + 1)} disabled={qty >= product.stock}>+</button>
              </div>
              <div className="row-price">Rs. {product.price * qty}</div>
              <button className="link-btn danger" onClick={() => removeFromCart(product._id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="summary">
          <h3>Order summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>Rs. {itemsPrice}</span></div>
          <div className="sum-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span>
          </div>
          {delivery > 0 && (
            <div className="muted">Free delivery on orders above Rs. {FREE_DELIVERY_ABOVE}</div>
          )}
          <div className="sum-row total"><span>Total</span><span>Rs. {itemsPrice + delivery}</span></div>
          <button className="btn" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
        </div>
      </div>
    </>
  );
}
