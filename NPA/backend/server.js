require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable mongoose debug to log queries
mongoose.set('debug', true);

// Middleware setup with try-catch
try {
  app.use(cors());
  app.use(express.json());
  console.log('Middleware initialized successfully');
} catch (middlewareErr) {
  console.error('Middleware initialization error:', middlewareErr);
}

// Load and log Mongo URL
let mongoURL;
try {
  mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/productlist';
  console.log('Mongo URL:', mongoURL);
} catch (envErr) {
  console.error('Error loading environment variable MONGO_URL:', envErr);
}

// Connect to MongoDB with try-catch async IIFE
(async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');
  } catch (connErr) {
    console.error('MongoDB connection error:', connErr);
    process.exit(1);
  }
})();

// Define Product schema and model with try-catch
let Product;
try {
  const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    image: String,
    specs: Object,
    prices: Array,
    affiliateLinks: Array,
  });
  Product = mongoose.model('Product', productSchema, 'products');
  console.log('Product model initialized');
} catch (modelErr) {
  console.error('Error defining Product model:', modelErr);
}

// Root route
app.get('/', (req, res) => {
  try {
    res.send('Backend server is running!');
  } catch (err) {
    console.error('Error in root route:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get all products route with try-catch and detailed logging
app.get('/api/products', async (req, res) => {
  console.log('GET /api/products called');
  try {
    const products = await Product.find({});
    console.log(`Fetched ${products.length} products`);
    console.dir(products, { depth: null });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a product route with try-catch
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    console.log('Product saved:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Start server with try-catch
const PORT = process.env.PORT || 5000;
try {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
} catch (serverErr) {
  console.error('Server startup error:', serverErr);
}
