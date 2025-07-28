import React, { useEffect, useState } from 'react';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product._id}>
              <img src={product.image} alt={product.name} width={100} />
              <h3>{product.name}</h3>
              <p>Brand: {product.brand}</p>
              <p>Specs: RAM - {product.specs.RAM}, Storage - {product.specs.Storage}</p>
              <ul>
                {product.prices.map((priceObj, idx) => (
                  <li key={idx}>
                    {priceObj.source}: ₹{priceObj.price} (<a href={priceObj.url} target="_blank" rel="noopener noreferrer">Buy</a>)
                  </li>
                ))}
              </ul>
              <ul>
                {product.affiliateLinks.map((linkObj, idx) => (
                  <li key={idx}>
                    Affiliate: <a href={linkObj.url} target="_blank" rel="noopener noreferrer">{linkObj.source}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
