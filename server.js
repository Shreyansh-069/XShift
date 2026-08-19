import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import { fileURLToPath } from 'url';
import PDF from './models/pdf.model.js';
import crypto from 'crypto';
import DraftImage from './models/draft_image.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

connectDB();
// Setup Multer for uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, Images)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added to parse JSON bodies

// --- Routes ---

app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

// 3. Conversion Hook Route
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image uploaded.');
        }

        const pdfDoc = await PDFDocument.create();
        let image;
        if (req.file.mimetype === 'image/jpeg') {
            image = await pdfDoc.embedJpg(req.file.buffer);
        } else if (req.file.mimetype === 'image/png') {
            image = await pdfDoc.embedPng(req.file.buffer);
        } else {
            return res.status(400).send('Unsupported image format. Only JPEG and PNG are allowed.');
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });

        const pdfBytes = await pdfDoc.save();
        const fileName = `Xshift-${Date.now()}.pdf`;

        // Save PDF to MongoDB Atlas
        await PDF.create({
            fileName,
            data: Buffer.from(pdfBytes)
        });

        res.redirect(`/loading?file=${fileName}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Magical conversion failed due to an arcane error.');
    }
});

// 3a. Multiple Images Upload Endpoint
app.post('/upload-images', upload.array('images'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No images uploaded.');
        }

        const draftId = crypto.randomUUID();

        // Save each image in DraftImage collection
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            await DraftImage.create({
                draftId,
                data: file.buffer,
                mimetype: file.mimetype
            });
        }

        res.redirect(`/preview/${draftId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to stage images for preview.');
    }
});

// 3b. Preview and Reorder Page
app.get('/preview/:draftId', async (req, res) => {
    try {
        const draftId = req.params.draftId;
        const images = await DraftImage.find({ draftId }).select('_id mimetype');
        if (!images || images.length === 0) {
            return res.status(404).send('Draft session not found or has expired. Please try uploading again.');
        }
        res.render('pages/preview', { draftId, images });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading preview page.');
    }
});

// 3c. Serve individual staged images
app.get('/draft/:draftId/image/:imageId', async (req, res) => {
    try {
        const { draftId, imageId } = req.params;
        const image = await DraftImage.findOne({ draftId, _id: imageId });
        if (!image) {
            return res.status(404).send('Image not found.');
        }
        res.setHeader('Content-Type', image.mimetype);
        res.send(image.data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving image.');
    }
});

// 3d. Final conversion endpoint with order list
app.post('/draft/:draftId/convert', async (req, res) => {
    try {
        const { draftId } = req.params;
        const { order } = req.body; // Array of image IDs in desired order

        if (!order || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing image order.' });
        }

        // Fetch draft images from database
        const images = await DraftImage.find({ draftId });
        if (!images || images.length === 0) {
            return res.status(404).json({ error: 'Draft session has expired or does not exist.' });
        }

        // Create a map for quick lookup
        const imageMap = new Map();
        images.forEach(img => {
            imageMap.set(img._id.toString(), img);
        });

        // Initialize PDF Document
        const pdfDoc = await PDFDocument.create();

        // Process images in specified order
        for (const imgId of order) {
            const img = imageMap.get(imgId);
            if (!img) continue; // Skip if ID is invalid or missing

            let embeddedImg;
            if (img.mimetype === 'image/jpeg' || img.mimetype === 'image/jpg') {
                embeddedImg = await pdfDoc.embedJpg(img.data);
            } else if (img.mimetype === 'image/png') {
                embeddedImg = await pdfDoc.embedPng(img.data);
            } else {
                continue; // Skip unsupported types
            }

            const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
            page.drawImage(embeddedImg, {
                x: 0,
                y: 0,
                width: embeddedImg.width,
                height: embeddedImg.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `Xshift-${Date.now()}.pdf`;

        // Save PDF to MongoDB
        await PDF.create({
            fileName,
            data: Buffer.from(pdfBytes)
        });

        // Delete draft images from database to free space
        await DraftImage.deleteMany({ draftId });

        res.json({ success: true, file: fileName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Magical conversion failed.' });
    }
});

// 4. Loading Page (Crystal Ball)
app.get('/loading', (req, res) => {
    res.render('pages/loading', { file: req.query.file });
});

// 5. Success Page (Masterpiece)
app.get('/success', (req, res) => {
    res.render('pages/success', { file: req.query.file });
});

// Mock download hook
app.get('/download-pdf', (req, res) => {
    res.send("In a real implementation, the generated PDF file stream would be sent here.");
});

// 6. Serve PDFs from database
app.get('/uploads/:file', async (req, res) => {
    try {
        const file = await PDF.findOne({ fileName: req.params.file });
        if (!file) {
            return res.status(404).send('File not found or has expired. Please try converting again.');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
        res.send(file.data);
    } catch (err) {
        console.error('Error retrieving PDF:', err);
        res.status(500).send('Error retrieving file from the database.');
    }
});

// Start Server
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Xshift Magic Server is running at http://localhost:${port}`);
        console.log(`Open http://localhost:${port}/ in your browser to view the app!`);
    });
}

export default app;
