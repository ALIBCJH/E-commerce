import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try{
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
        console.log('Connecting to MongoDB with URI:', mongoUri.replace(/\/\/.*:.*@/, '//<credentials>@'));
        
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    } catch(error){
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error(`Full error:`, error);
        console.error(`\nTroubleshooting steps:`);
        console.error(`1. Check if MongoDB Atlas cluster is running (might be paused)`);
        console.error(`2. Verify your connection string in .env file`);
        console.error(`3. Check your IP is whitelisted in MongoDB Atlas (Network Access)`);
        console.error(`4. Try getting a fresh connection string from Atlas dashboard`);
        throw error; // Re-throw to let server.js handle it
    }
}
export default connectDB;