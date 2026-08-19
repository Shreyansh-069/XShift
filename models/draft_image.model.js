import mongoose from 'mongoose';

const draftImageSchema = new mongoose.Schema({
    draftId: {
        type: String,
        required: true,
        index: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800, // 30 minutes TTL
    }
});

const DraftImage = mongoose.model('DraftImage', draftImageSchema);

export default DraftImage;
