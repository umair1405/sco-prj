import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import couponsRouter from './routes/coupons.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize MongoDB Connection & Seeding
const initApp = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedDatabase();
  }
};

initApp();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    brand: 'Senora & Co', 
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString() 
  });
});

// Root API status
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Senora & Co E-Commerce API',
    endpoints: [
      '/api/products',
      '/api/orders',
      '/api/coupons',
      '/api/coupons/validate',
      '/api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🌸 Senora & Co Backend running on http://localhost:${PORT}`);
});

export default app;
