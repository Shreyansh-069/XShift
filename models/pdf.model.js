import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800, // 30 minutes (1800 seconds)
    }
});

const PDF = mongoose.model('pdf', pdfSchema);

export default PDF;
