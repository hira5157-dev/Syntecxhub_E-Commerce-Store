import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { productVisual } from '../utils/productVisual.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const outOfStock = product.stock < 1;
  const { emoji, bg } = productVisual(product);
  const showImage = product.image && !imgFailed;

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={outOfStock ? 'card sold-out' : 'card'}>
      <div className="card-img" style={{ background: bg }}>
        {showImage ? (
          <img src={product.image} alt={product.name} onError={() => setImgFailed(true)} />
        ) : (
          <span className="card-emoji">{emoji}</span>
        )}
        <span className="badge">{product.category}</span>
        {outOfStock && <span className="sold-tag">Out of stock</span>}
      </div>
      <div className="card-body">
        <div className="card-title">{product.name}</div>
        <div className="price-row">
          <span className="price">Rs. {product.price}</span>
          <span className="muted">/ {product.unit}</span>
        </div>
        {!outOfStock && product.stock < 10 && (
          <div className="stock low-stock">Only {product.stock} left</div>
        )}
        <button className="btn" onClick={handleAdd} disabled={outOfStock}>
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
