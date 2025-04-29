import mongoose from 'mongoose';

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true, // Retain this option for connection pooling and other enhancements
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
    });
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default DbCon;
