import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
async function connectDB() {
    if (!MONGO_URI) {
        console.error('CRITICAL ERROR: MONGO_URI environment variable is not defined!');
        console.error('Please configure MONGO_URI in your environment variables or .env file.');
        process.exit(1);
    }
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB database successfully.`);
    }
    catch(error) {
        console.error(`connectDB error : ${error.message}`);
        throw error;
    }
} 

export default connectDB;