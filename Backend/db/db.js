import mongoose from 'mongoose';

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
});

    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

export default DbCon;
