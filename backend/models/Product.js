import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, default: 'Standard' },
  hex: { type: String, default: '#8E704F' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['top-bottom', 'abayas', 'onepiece', 'jeans', 'all'] 
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 12 },
  isBestSeller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  stock: { type: Number, default: 10 },
  sizes: [{ type: String }],
  colors: [colorSchema],
  images: [{ type: String }],
  shortDesc: { type: String },
  description: { type: String },
  fabric: { type: String, default: 'Korean Silk & Cotton Blend' },
  care: { type: String, default: 'Dry clean recommended' },
  delivery: { type: String, default: 'Ships in 24-48 Hours' },
  tag: { type: String }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
