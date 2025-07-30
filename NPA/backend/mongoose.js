// checkMongoose.js
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/productlist';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Mongoose connected');
})
.catch(err => {
  console.error('Mongoose connection error:', err);
});

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function fetchProducts() {
  try {
    const products = await Product.find({});
    console.log('Products fetched by Mongoose:', products.length);
    products.forEach(p => console.log(p.name));
  } catch (err) {
    console.error('Mongoose fetch error:', err);
  } finally {
    mongoose.connection.close();
  }
}

fetchProducts();
