import Order from '../models/Order.js';
import Product from '../models/Product.js';

const FREE_DELIVERY_ABOVE = 2000;
const DELIVERY_FEE = 150;

// POST /api/orders
// body: { items: [{ product: "<id>", qty: 2 }], shipping: { fullName, phone, address, city } }
export const createOrder = async (req, res) => {
  const reserved = []; // stock already deducted, restored if the order fails
  try {
    const { items, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    const { fullName, phone, address, city } = shipping || {};
    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ message: 'Please fill in all delivery details' });
    }

    const orderItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      const qty = parseInt(item.qty);
      if (!qty || qty < 1) {
        throw new Error('Invalid quantity');
      }
      // atomic update: only deduct if enough stock is available
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );
      if (!product) {
        const exists = await Product.findById(item.product);
        throw new Error(
          exists
            ? `${exists.name} has low stock (available: ${exists.stock})`
            : 'One of the products is no longer available'
        );
      }
      reserved.push({ id: product._id, qty });
      // always take the price from the database, never from the client
      orderItems.push({
        product: product._id,
        name: product.name,
        unit: product.unit,
        price: product.price,
        qty,
      });
      itemsPrice += product.price * qty;
    }

    const deliveryPrice = itemsPrice >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shipping: { fullName, phone, address, city },
      paymentMethod: 'COD',
      itemsPrice,
      deliveryPrice,
      totalPrice: itemsPrice + deliveryPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    // restore stock
    for (const r of reserved) {
      await Product.findByIdAndUpdate(r.id, { $inc: { stock: r.qty } });
    }
    res.status(400).json({ message: error.message });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders  (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
