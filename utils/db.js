import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
async function connectDB() {
    try {
        const connection = mongoose.connect(MONGO_URI);
        console.log(`Connected to DB`)
    }
    catch(error) {
        console.log(`connectDB error : ${error.message}`);
    }
} 

export default connectDB;