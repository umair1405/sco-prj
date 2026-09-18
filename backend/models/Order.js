import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String }
  },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: 'M' },
  selectedColor: { type: String, default: 'Signature' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
  items: [orderItemSchema],
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Kerala' },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'UPI (GPAY / PHONEPE)' },
  coupon: { type: String, default: null },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  }
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
