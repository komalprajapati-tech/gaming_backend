const mongoose = require('mongoose');   // <-- REQUIRED

const GamingSchema = new mongoose.Schema({
  squad: { type: String, required: true },

  leaderName: { type: String, required: true },
  leaderRoll: { type: String, required: true, unique: true },
  leaderMobile: { type: String, required: true },

  p2name: { type: String },
  p2roll: { type: String },

  p3name: { type: String },
  p3roll: { type: String },

  p4name: { type: String },
  p4roll: { type: String },

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gaming", GamingSchema);
