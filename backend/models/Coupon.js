import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: String, required: true }, // e.g. "10% OFF", "₹500 OFF"
  type: { type: String, enum: ['percentage', 'flat', 'percent', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 2000 },
  uses: { type: Number, default: 0 },
  maxUses: { type: Number, default: 1000 },
  status: { type: String, enum: ['Active', 'Expired', 'Disabled'], default: 'Active' }
}, {
  timestamps: true
});

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
