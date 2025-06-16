import mongoose from 'mongoose';

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true, // Optional but recommended
      serverSelectionTimeoutMS: 30000, // Optional, good for production
    });
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit app if DB connection fails
  }
};

export default DbCon;
