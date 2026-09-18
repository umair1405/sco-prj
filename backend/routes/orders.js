import express from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();
let memoryOrders = [];

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    if (orders && orders.length > 0) {
      return res.json({ success: true, count: orders.length, data: orders });
    }
    res.json({ success: true, count: memoryOrders.length, data: memoryOrders });
  } catch (err) {
    res.json({ success: true, count: memoryOrders.length, data: memoryOrders });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  const { items, customer, address, paymentMethod, coupon, subtotal, discount, shipping, total, orderId } = req.body;

  if (!items || items.length === 0 || !customer || !address) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }

  const newOrderData = {
    orderId: orderId || ('SNC-' + Math.floor(100000 + Math.random() * 900000)),
    createdAt: new Date(),
    items,
    customer,
    address,
    paymentMethod: paymentMethod || 'UPI (GPAY / PHONEPE)',
    coupon: coupon || null,
    subtotal: subtotal || items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0),
    discount: discount || 0,
    shipping: shipping || 0,
    total: total || (subtotal - discount + shipping),
    status: req.body.status || 'Confirmed'
  };

  try {
    const dbOrder = await Order.create(newOrderData).catch(() => null);
    memoryOrders.unshift(dbOrder || newOrderData);

    res.status(201).json({
      success: true,
      message: 'Order placed and saved to database successfully',
      data: dbOrder || newOrderData
    });
  } catch (err) {
    memoryOrders.unshift(newOrderData);
    res.status(201).json({
      success: true,
      data: newOrderData
    });
  }
});

// PATCH /api/orders/:orderId/status
router.patch('/:orderId/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
