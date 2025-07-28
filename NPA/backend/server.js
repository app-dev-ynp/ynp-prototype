require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/NPA', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product model
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  specs: Object,
  prices: Array,
  affiliateLinks: Array,
}));

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add a product
app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});