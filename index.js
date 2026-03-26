import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import connectDB from './utils/db.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoute);

app.listen(PORT, () => {
    console.log(`Server running at PORT : ${PORT}`)
    connectDB();
})