import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/products.json');

export const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        const initialProducts = JSON.parse(raw);
        if (Array.isArray(initialProducts) && initialProducts.length > 0) {
          await Product.insertMany(initialProducts);
          console.log(`🌸 Seeded ${initialProducts.length} luxury products into MongoDB Atlas!`);
        }
      }
    }

    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const initialCoupons = [
        { code: 'SENORA10', discount: '10% OFF', type: 'percentage', value: 10, minOrder: 0, maxDiscount: 2000, status: 'Active' },
        { code: 'SAVE500', discount: '₹500 OFF', type: 'flat', value: 500, minOrder: 2500, maxDiscount: 500, status: 'Active' },
        { code: 'FIRSTDROP', discount: '₹500 OFF', type: 'flat', value: 500, minOrder: 2000, maxDiscount: 500, status: 'Active' },
        { code: 'VIP20', discount: '20% OFF', type: 'percentage', value: 20, minOrder: 5000, maxDiscount: 3000, status: 'Active' }
      ];
      await Coupon.insertMany(initialCoupons);
      console.log(`🌸 Seeded initial boutique promo codes into MongoDB Atlas!`);
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const initialOrders = [
        {
          orderId: 'SNC-849201',
          createdAt: new Date(Date.now() - 3600000 * 4),
          items: [
            {
              product: {
                id: 'sen-op-2',
                name: 'Seraphina Pleated Georgette Maxi',
                price: 3199,
                images: ['/products/onepice/2/SaveClip.App_729660722_18094774553578472_7927858063859501886_n.jpg'],
                category: 'onepiece'
              },
              quantity: 1,
              selectedSize: 'M',
              selectedColor: 'Signature'
            }
          ],
          customer: {
            name: 'Aysha Fatima',
            phone: '+91 98471 23456',
            email: 'aysha.f@gmail.com'
          },
          address: {
            street: 'Hill Palace Road, Flat 4B',
            city: 'Kozhikode',
            state: 'Kerala',
            pincode: '673001'
          },
          paymentMethod: 'UPI (GPAY)',
          coupon: 'SENORA10',
          subtotal: 3199,
          discount: 320,
          shipping: 0,
          total: 2879,
          status: 'Confirmed'
        },
        {
          orderId: 'SNC-731904',
          createdAt: new Date(Date.now() - 3600000 * 26),
          items: [
            {
              product: {
                id: 'sen-tb-1',
                name: 'Aurelia Blue Printed Co-ord Set',
                price: 2899,
                images: ['/products/top-bottom/1/SaveClip.App_797052405_18075465737719284_2560992149797565467_n.jpg'],
                category: 'top-bottom'
              },
              quantity: 1,
              selectedSize: 'S',
              selectedColor: 'Noir Black'
            }
          ],
          customer: {
            name: 'Dr. Reem Hameed',
            phone: '+91 97455 89012',
            email: 'reem.hameed@outlook.com'
          },
          address: {
            street: 'Beach Road, Villa 12',
            city: 'Kannur',
            state: 'Kerala',
            pincode: '670001'
          },
          paymentMethod: 'Credit/Debit Card',
          coupon: 'SAVE500',
          subtotal: 2899,
          discount: 500,
          shipping: 0,
          total: 2399,
          status: 'Shipped'
        }
      ];
      await Order.insertMany(initialOrders);
      console.log(`🌸 Seeded sample boutique orders into MongoDB Atlas!`);
    }
  } catch (err) {
    console.error('Database seeding error:', err.message);
  }
};
