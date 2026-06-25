import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.route.js';
import PDF from './models/pdf.model.js';

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

// 0. Signup Page
app.get('/signup', (req, res) => {
    res.render('pages/signup');
});


app.use('/api', authRoute);

// --- Routes ---

app.get('/', (req, res) => {
    res.redirect('/login');
});


// 1. Login Page
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// 2. Home Page (Upload Dashboard)
app.get('/home', (req, res) => {
    res.render('pages/home');
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
