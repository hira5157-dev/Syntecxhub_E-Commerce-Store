import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const products = [
  { name: 'Tomatoes', category: 'Vegetables', unit: 'kg', price: 180, stock: 40 },
  { name: 'Potatoes', category: 'Vegetables', unit: 'kg', price: 110, stock: 60 },
  { name: 'Onions', category: 'Vegetables', unit: 'kg', price: 130, stock: 50 },
  { name: 'Spinach', category: 'Vegetables', unit: 'bunch', price: 60, stock: 30 },
  { name: 'Bananas', category: 'Fruits', unit: 'dozen', price: 220, stock: 35 },
  { name: 'Apples', category: 'Fruits', unit: 'kg', price: 350, stock: 25 },
  { name: 'Oranges', category: 'Fruits', unit: 'dozen', price: 300, stock: 20 },
  { name: 'Fresh Milk', category: 'Dairy', unit: 'litre', price: 210, stock: 50 },
  { name: 'Eggs', category: 'Dairy', unit: 'dozen', price: 360, stock: 40 },
  { name: 'Yogurt', category: 'Dairy', unit: 'kg', price: 260, stock: 25 },
  { name: 'Brown Bread', category: 'Bakery', unit: 'piece', price: 140, stock: 20 },
  { name: 'Buns', category: 'Bakery', unit: 'dozen', price: 180, stock: 15 },
  { name: 'Orange Juice', category: 'Beverages', unit: 'litre', price: 290, stock: 30 },
  { name: 'Mineral Water', category: 'Beverages', unit: 'piece', price: 90, stock: 100 },
  { name: 'Potato Chips', category: 'Snacks', unit: 'piece', price: 100, stock: 80 },
  { name: 'Biscuits', category: 'Snacks', unit: 'piece', price: 70, stock: 90 },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany();
  await Product.insertMany(products);
  console.log(`${products.length} products added`);

  const adminEmail = 'admin@grocery.com';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin created: admin@grocery.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
