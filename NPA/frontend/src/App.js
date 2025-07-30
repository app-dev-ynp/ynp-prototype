import React, { useEffect, useState, useCallback, useRef } from 'react';

const CATEGORIES = ['SmartPhones'];

const PRICE_RANGES = [
  { label: 'Basic', emoji: '💰', range: [0, 5000] },
  { label: 'Budget', emoji: '💰', range: [5000, 15000] },
  { label: 'Mid-Range', emoji: '💰', range: [15000, 25000] },
  { label: 'Upper Mid-Range', emoji: '💰', range: [25000, 45000] },
  { label: 'Flagship', emoji: '💰', range: [45000, 80000] },
  { label: 'Ultra-Premium', emoji: '💰', range: [80000, Infinity] },
];

const PRODUCTS_PER_LOAD = 6;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Products shown for infinite scroll
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadIndex, setLoadIndex] = useState(1);

  // Modal product
  const [modalProduct, setModalProduct] = useState(null);

  const loaderRef = useRef();

  // Fetch all products on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Dark mode toggle effect
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Filter products by category, price range, brand and search term
  const filteredProducts = products.filter((product) => {
    // Category filter (only smartphones for now)
    if (selectedCategory === 'SmartPhones') {
      // Assume all products are smartphones here, else you could filter by product.category === 'SmartPhones'
    }

    // Price range filter
    if (selectedPriceRange) {
      const price = product.prices?.[0]?.price ?? 0;
      const [min, max] = selectedPriceRange.range;
      if (price < min || price > max) return false;
    }

    // Brand filter
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }

    // Search filter (name or brand)
    if (
      search &&
      !(
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  // Unique brands from filtered products for brand list
  const brands = Array.from(new Set(filteredProducts.map(p => p.brand))).sort();

  // Infinite scroll: load products according to loadIndex
  useEffect(() => {
    const newProducts = filteredProducts.slice(0, loadIndex * PRODUCTS_PER_LOAD);
    setDisplayedProducts(newProducts);
  }, [filteredProducts, loadIndex]);

  // IntersectionObserver for infinite scroll trigger
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setLoadIndex((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const currentLoader = loaderRef.current; // cache the current ref value

    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  // Top 5 phones (overall) to show on top
  const top5Phones = products
    .sort((a, b) => (b.prices?.[0]?.price ?? 0) - (a.prices?.[0]?.price ?? 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-xl">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header */}
      <header className="max-w-6xl mx-auto p-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-4xl font-bold mb-4 sm:mb-0 text-indigo-600 dark:text-indigo-400">
          YourAppTitle
        </h1>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* Categories Tabs */}
      <nav className="max-w-6xl mx-auto flex space-x-6 border-b border-gray-300 dark:border-gray-700 px-6">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedBrand(null);
              setSelectedPriceRange(null);
              setSearch('');
              setLoadIndex(1);
            }}
            className={`py-3 font-semibold text-lg border-b-4 ${
              selectedCategory === category
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            } transition`}
          >
            {category}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Top 5 Phones Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Top 5 Phones</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {top5Phones.map(product => (
              <li
                key={product._id}
                className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 bg-white dark:bg-gray-800 flex flex-col cursor-pointer"
                onClick={() => setModalProduct(product)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setModalProduct(product);
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-3"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">₹{product.prices?.[0]?.price ?? 'N/A'}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Purchase Categories Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Purchase Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PRICE_RANGES.map(({ label, emoji, range }) => (
              <button
                key={label}
                onClick={() => {
                  setSelectedPriceRange({ label, emoji, range });
                  setSelectedBrand(null);
                  setLoadIndex(1);
                }}
                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border ${
                  selectedPriceRange?.label === label
                    ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900'
                    : 'border-gray-300 dark:border-gray-700 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800'
                } transition`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-semibold">{label}</span>
                <small className="text-gray-600 dark:text-gray-400">
                  {`₹${range[0].toLocaleString()} – ₹${range[1] === Infinity ? '+' : range[1].toLocaleString()}`}
                </small>
              </button>
            ))}
            {/* Clear price range filter */}
            {selectedPriceRange && (
              <button
                onClick={() => {
                  setSelectedPriceRange(null);
                  setLoadIndex(1);
                }}
                className="col-span-full mt-2 text-sm text-indigo-600 hover:underline"
              >
                Clear Price Filter
              </button>
            )}
          </div>
        </section>

        {/* Brands Section */}
        {selectedCategory && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Brands</h2>
            {brands.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">No brands found for selected filters.</p>
            )}
            <div className="flex flex-wrap gap-3">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand === selectedBrand ? null : brand);
                    setLoadIndex(1);
                  }}
                  className={`px-4 py-2 rounded-full border font-semibold cursor-pointer transition ${
                    selectedBrand === brand
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        {selectedBrand && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Products - {selectedBrand}</h2>
            {displayedProducts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No products found for this brand and filters.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedProducts
                  .filter((p) => p.brand === selectedBrand)
                  .map(product => (
                    <li
                      key={product._id}
                      className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 bg-white dark:bg-gray-800 flex flex-col cursor-pointer"
                      onClick={() => setModalProduct(product)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setModalProduct(product);
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-3"
                        loading="lazy"
                      />
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                        ₹{product.prices?.[0]?.price ?? 'N/A'}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            {/* Loader div for infinite scroll */}
            <div ref={loaderRef} />
          </section>
        )}

      </main>

      {/* Product Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={() => setModalProduct(null)}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-full overflow-y-auto p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
              onClick={() => setModalProduct(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <img
              src={modalProduct.image}
              alt={modalProduct.name}
              className="w-full h-64 object-contain mb-4"
              loading="lazy"
            />
            <h3 className="text-2xl font-bold mb-2">{modalProduct.name}</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">Brand: {modalProduct.brand}</p>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              RAM: {modalProduct.specs?.RAM} | Storage: {modalProduct.specs?.Storage}
            </p>
            <h4 className="font-semibold mb-2">Prices:</h4>
            <ul className="mb-4 list-disc list-inside text-indigo-600 dark:text-indigo-400">
              {modalProduct.prices?.map((price, i) => (
                <li key={i}>
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {price.source}: ₹{price.price.toLocaleString()}
                  </a>
                </li>
              ))}
            </ul>
            {modalProduct.affiliateLinks && (
              <>
                <h4 className="font-semibold mb-2">Affiliate Links:</h4>
                <ul className="list-disc list-inside text-indigo-600 dark:text-indigo-400">
                  {modalProduct.affiliateLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {link.source}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* 
      Pagination Code for future if needed:

      const [page, setPage] = useState(1);
      const ITEMS_PER_PAGE = 6;
      const paginatedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

      // Load more button for pagination:
      <button onClick={() => setPage(page + 1)} className="btn-load-more">Load More</button>
      */}

    </div>
  );
}

export default App;
