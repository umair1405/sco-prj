import express from 'express';
import { Coupon } from '../models/Coupon.js';

const router = express.Router();

const VALID_COUPONS = {
  SENORA10: { code: 'SENORA10', value: 10, type: 'percent', label: '10% OFF Special Boutique Discount' },
  SAVE500: { code: 'SAVE500', value: 500, type: 'fixed', label: '₹500 OFF Boutique Discount' },
  FIRSTDROP: { code: 'FIRSTDROP', value: 500, type: 'fixed', label: '₹500 OFF First Order' },
  VIP20: { code: 'VIP20', value: 20, type: 'percent', label: '20% OFF VIP Drop' },
  FREESHIP: { code: 'FREESHIP', value: 149, type: 'shipping', label: 'Free Express Shipping' }
};

// GET /api/coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    if (coupons && coupons.length > 0) {
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
    const list = Object.values(VALID_COUPONS);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    const list = Object.values(VALID_COUPONS);
    res.json({ success: true, count: list.length, data: list });
  }
});

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const clean = code.trim().toUpperCase();

  try {
    const dbCoupon = await Coupon.findOne({ code: clean, status: 'Active' });
    if (dbCoupon) {
      return res.json({
        success: true,
        data: {
          code: dbCoupon.code,
          value: dbCoupon.value,
          type: dbCoupon.type === 'percentage' ? 'percent' : 'fixed',
          label: `${dbCoupon.discount} Exclusive Discount`
        }
      });
    }
  } catch (err) {}

  const found = VALID_COUPONS[clean];
  if (found) {
    return res.json({ success: true, data: found });
  } else {
    return res.status(404).json({ success: false, message: 'Invalid coupon code. Try SENORA10 for 10% off.' });
  }
});

export default router;
