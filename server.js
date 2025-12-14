const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const gamingRoutes = require('./routes/gamingRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // if you have admin APIs

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
// Keep APIs ABOVE static routes
app.use('/api', gamingRoutes);
app.use('/api', hackathonRoutes);
// app.use('/api/admin', adminRoutes); // optional

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ================= ANGULAR APPS =================

// 🎮 GAMING APP
app.use(
  '/gaming',
  express.static(path.join(__dirname, 'dist/gaming/browser'))
);
app.get(/^\/gaming\/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist/gaming/browser/index.html')
  );
});

// 🏆 HACKATHON APP
app.use(
  '/hackathon',
  express.static(path.join(__dirname, 'dist/hackathon/browser'))
);
app.get(/^\/hackathon\/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist/hackathon/browser/index.html')
  );
});

// 🛠️ ADMIN PANEL
app.use(
  '/admin_panel',
  express.static(path.join(__dirname, 'dist/admin_panel/browser'))
);
app.get(/^\/admin_panel\/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist/admin_panel/browser/index.html')
  );
});

// ================= TEST ROUTE =================
app.get('/', (req, res) => {
  res.send("Backend running: Gaming / Hackathon / Admin");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
