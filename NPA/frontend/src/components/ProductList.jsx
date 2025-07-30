import React, { useEffect, useState } from 'react';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <header className="header">
        <h1>NPA Product Catalog</h1>
      </header>
      <main>
        {products.length === 0 ? (
          <div className="empty">No products found.</div>
        ) : (
          <div className="grid">
            {products.map(product => (
              <div className="card" key={product._id}>
                <img src={product.image} alt={product.name} className="product-image" />
                <h2 className="product-name">{product.name}</h2>
                <div className="brand">{product.brand}</div>
                <div className="specs">
                  <span>RAM: {product.specs?.RAM}</span>
                  <span>Storage: {product.specs?.Storage}</span>
                </div>
                <div className="prices">
                  {product.prices.map((p, i) => (
                    <div key={i}>
                      <b>{p.source}:</b> ₹{p.price} <a href={p.url} target="_blank" rel="noopener noreferrer">Buy</a>
                    </div>
                  ))}
                </div>
                <div className="affiliate-links">
                  {product.affiliateLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.source} Affiliate</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="footer">
        <span>© 2025 NPA</span>
      </footer>
    </div>
  );
}

export default ProductList;