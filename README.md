# Xshift ⚡📄
A fast, seamless image-to-PDF conversion web application wrapped in a stunning minimalistic Cyberpunk aesthetic, built with Node.js, Express, pdf-lib, and MongoDB.

## ✨ Features
- **🔄 Instant PDF Conversion** — Upload JPEG or PNG files and instantly convert them into downloadable PDF documents.
- **🎨 Premium Cyberpunk UI** — Modern, minimalistic design featuring glassmorphism, glowing neon accents, and pixel-glitch animations.
- **🔐 Secure Authentication** — Robust user login and signup workflow protected by JWT and bcrypt.
- **⚡ Immersive Animations** — Fluid interface transitions, including custom pixel dissolve effects and glitchy loading bars.
- **🖥️ Server-Side Rendering** — Fast, dynamic pages powered by EJS templating.

## 🛠️ Tech Stack
| Layer | Technology |
| --- | --- |
| **Backend** | Node.js, Express.js |
| **Frontend** | EJS, HTML, CSS, Vanilla JavaScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Processing** | Multer (Memory Storage), pdf-lib |
| **Auth** | JSON Web Tokens (JWT), bcrypt |

## 📁 Project Structure
```text
Xshift/
├── controllers/
│   └── auth.controller.js       # Handles login, signup, and cookie-based logout
├── models/
│   └── user.model.js            # Mongoose schema for secure user credentials
├── public/
│   ├── style.css                # Central stylesheet for the Cyberpunk UI theme
│   └── uploads/                 # Storage for generated PDF files
├── routes/
│   └── auth.route.js            # API routing for authentication endpoints
├── utils/
│   ├── db.js                    # MongoDB connection utility
│   └── token.js                 # JWT cookie generation utility
├── views/
│   ├── partials/header.ejs      # Shared application header with modern fonts
│   └── pages/                   
│       ├── login.ejs            # Cyberpunk login portal
│       ├── signup.ejs           # Account creation portal
│       ├── home.ejs             # Main upload dashboard
│       ├── loading.ejs          # Animated conversion loading screen
│       └── success.ejs          # PDF download page with pixel confetti
├── server.js                    # Main Express server and PDF generation logic
└── package.json                 # Core dependencies and scripts (ES Modules)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas cluster)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/Xshift.git
cd Xshift
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
JWT_KEY=your_super_secret_jwt_key
```

**4. Start the development server**
```bash
npm run dev
```
The app will be available at `http://localhost:5050`

## 📖 How It Works
- **Sign up** — Create an account on the signup page to gain access to the application.
- **Upload** — Use the minimal glassmorphic dashboard to select any local `.jpeg` or `.png` file.
- **Convert** — Submit the file to instantly trigger `pdf-lib` backend processing.
- **Download** — Watch the beautiful conversion animation, then download your brand-new PDF straight to your device.

## 🤝 Contributing
Contributions are welcome! If you'd like to improve Xshift:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.
