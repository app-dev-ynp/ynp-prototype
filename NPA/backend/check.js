const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('productlist');
  const products = await db.collection('products').find().toArray();
  console.log('Mongo shell check, products count:', products.length);
  await client.close();
}

check();
