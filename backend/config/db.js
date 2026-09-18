import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set. Backend will use local fallback storage.');
    return false;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    }).then((mongooseInstance) => {
      console.log(`🌿 MongoDB Connected: ${mongooseInstance.connection.host} (${mongooseInstance.connection.name})`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ MongoDB Connection Error:', err.message);
      return false;
    });
  }

  cached.conn = await cached.promise;
  return !!cached.conn;
};
