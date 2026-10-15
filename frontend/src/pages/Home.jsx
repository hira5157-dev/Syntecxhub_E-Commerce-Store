import { useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import { categoryEmoji } from '../utils/productVisual.js';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Snacks'];

// Tried in order: your own file first, then free Unsplash photos, then the emoji fallback
const HERO_PHOTOS = [
  '/images/hero.jpg',
  'https://unsplash.com/photos/nXKDqpmdx_8/download?force=true&w=1600',
  'https://unsplash.com/photos/GPxxXAbzsXU/download?force=true&w=1600',
];

const FEATURES = [
  ['🥬', 'Farm fresh', 'Fresh fruits and vegetables every morning'],
  ['🚚', 'Fast delivery', 'Free delivery on orders above Rs. 2000'],
  ['💵', 'Cash on Delivery', 'Pay when your order arrives'],
  ['✅', 'Best quality', 'Carefully selected products'],
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
  const shopRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', {
          params: { search, category, page, limit: 12 },
        });
        setProducts(data.products);
        setPages(data.pages);
      } catch {
        setError('Failed to load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, page]);

  const scrollToShop = () => shopRef.current?.scrollIntoView({ behavior: 'smooth' });

  const pickCategory = (c) => {
    setCategory(c);
    setPage(1);
    scrollToShop();
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="hero-tag">100% fresh and safe</span>
          <h1>Fresh groceries, delivered to your door</h1>
          <p>Fruits, vegetables, dairy and daily essentials. Order online and pay with Cash on Delivery.</p>
          <button className="btn hero-cta" onClick={scrollToShop}>Shop now</button>
        </div>
        {heroIdx < HERO_PHOTOS.length ? (
          <img
            className="hero-photo"
            src={HERO_PHOTOS[heroIdx]}
            alt="Fresh vegetables and fruits"
            onError={() => setHeroIdx((i) => i + 1)}
          />
        ) : (
          <div className="hero-art" aria-hidden="true">
            <span>🍎</span><span>🥕</span><span>🥛</span><span>🍞</span>
            <span>🍌</span><span>🥬</span><span>🍅</span><span>🧃</span>
          </div>
        )}
        <div className="hero-badge">
          <span className="hero-badge-icon">🚚</span>
          <div>
            <strong>Free delivery</strong>
            <div className="muted">On orders above Rs. 2000</div>
          </div>
        </div>
      </section>

      <section className="features">
        {FEATURES.map(([icon, title, text]) => (
          <div className="feature" key={title}>
            <div className="feature-icon">{icon}</div>
            <div>
              <div className="feature-title">{title}</div>
              <div className="muted">{text}</div>
            </div>
          </div>
        ))}
      </section>

      <h2 className="section-title">Shop by category</h2>
      <section className="cat-tiles">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={c === category ? 'cat-tile active' : 'cat-tile'}
            onClick={() => pickCategory(c)}
          >
            <span className="cat-emoji">{c === 'All' ? '🛒' : categoryEmoji(c)}</span>
            {c}
          </button>
        ))}
      </section>

      <div ref={shopRef} className="shop-head">
        <h2 className="section-title">{category === 'All' ? 'Our products' : category}</h2>
        <input
          className="input search"
          placeholder="Search for milk, mangoes, bread..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && !error && <p className="muted">Loading...</p>}
      {!loading && !error && products.length === 0 && (
        <p className="muted">No products found.</p>
      )}

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button className="btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pages}</span>
          <button className="btn-outline" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      <section className="promo">
        <div>
          <h2>Free delivery on orders above Rs. 2000</h2>
          <p>Order your weekly groceries together and save on delivery charges.</p>
        </div>
        <button className="btn hero-btn" onClick={scrollToShop}>Order now</button>
      </section>
    </>
  );
}
