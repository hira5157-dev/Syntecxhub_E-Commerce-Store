import dns from 'dns';
import mongoose from 'mongoose';

// Some ISPs cannot resolve mongodb+srv addresses, so use Google/Cloudflare DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
