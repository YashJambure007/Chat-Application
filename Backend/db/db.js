import mongoose from 'mongoose';

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
});

    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit app if DB connection fails
  }
};

export default DbCon;
