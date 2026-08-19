# Xshift ⚡📄

A fast, seamless multi-image-to-PDF conversion web application with a drag-and-drop page reordering interface, built with Node.js, Express, pdf-lib, and MongoDB.

## ✨ Features
- **🔄 Multi-Image Upload** — Select and upload multiple JPEG or PNG files at once to compile into a single document.
- **↕️ Drag-and-Drop Reordering** — Dynamic staging preview screen that allows you to drag, drop, and rearrange pages before generating the PDF.
- **🎨 Premium Cyberpunk UI** — Modern, minimalistic theme featuring glassmorphism, glowing neon accents, and pixel-glitch animations.
- **⚡ Immersive Animations** — Fluid interface transitions, including custom pixel dissolve effects and a loading percentage bar.
- **🖥️ Server-Side Rendering** — Fast, dynamic pages powered by EJS templating.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | Node.js, Express.js |
| **Frontend** | EJS, HTML, CSS, Vanilla JavaScript (HTML5 Drag & Drop API) |
| **Database** | MongoDB (Mongoose ODM) |
| **Processing** | Multer (Memory Storage), pdf-lib |

---

## 📁 Project Structure

```text
Xshift/
├── models/
│   ├── draft_image.model.js     # Mongoose schema for temporary staging images (TTL auto-cleanup)
│   └── pdf.model.js             # Mongoose schema for binary PDF database storage (TTL auto-cleanup)
├── public/
│   ├── style.css                # Central stylesheet for the Cyberpunk UI theme
│   └── uploads/                 # Local uploads directory (not actively used for file serving)
├── utils/
│   └── db.js                    # MongoDB connection utility
├── views/
│   ├── partials/header.ejs      # Shared application header with Google Fonts
│   └── pages/                   
│       ├── home.ejs             # Main upload dashboard
│       ├── preview.ejs          # Drag-and-drop page reordering screen
│       ├── loading.ejs          # Animated conversion loading screen
│       └── success.ejs          # PDF download page with pixel confetti
├── server.js                    # Main Express server and PDF generation logic
└── package.json                 # Core dependencies and scripts (ES Modules)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas cluster)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Shreyansh-069/xshift.git
cd xshift
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
```

**4. Start the development server**
```bash
npm run dev
```
The app will be available at `http://localhost:5050`

---

## 📖 How It Works
- **Upload** — Choose one or more `.jpeg` or `.png` images on the clean dashboard.
- **Reorder** — Drag and rearrange the page thumbnails to adjust the page flow sequence.
- **Convert** — Submit the ordered sequence to trigger the `pdf-lib` backend compiler.
- **Download** — Watch the loading animation, then download your brand-new PDF directly.

---

## 🤝 Developer Details
* **Developer:** **SHREYANSH**
* **LinkedIn:** [Shreyansh Nechaniya](https://www.linkedin.com/in/shreyansh-nechaniya-4b5771375/)
* **GitHub:** [Shreyansh-069](https://github.com/Shreyansh-069)
