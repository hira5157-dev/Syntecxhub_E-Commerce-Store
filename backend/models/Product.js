import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Snacks'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'dozen', 'litre', 'piece', 'bunch'],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
