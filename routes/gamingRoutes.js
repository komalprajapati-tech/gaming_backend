const express = require('express');
const router = express.Router();
const Gaming = require('../models/gaming');

// POST API for saving gaming registration
router.post('/gaming/register', async (req, res) => {
  try {
    const newEntry = new Gaming(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Gaming Registration Successful!" });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate Roll Number Not Allowed!" });
    }

    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

// GET API - Fetch all gaming registrations
router.get('/gaming/list', async (req, res) => {
  try {
    const data = await Gaming.find().sort({ date: -1 });
    console.log("Fetched Data:", data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch gaming registrations", error: err });
  }
});

// ⭐⭐⭐ GET single entry by ID (required for edit page)
router.get('/gaming/:id', async (req, res) => {
  try {
    const data = await Gaming.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load entry", error: err });
  }
});

// CHECK IF ROLL NUMBER EXISTS
router.get('/gaming/check-roll/:roll', async (req, res) => {
  try {
    const roll = req.params.roll;

    const exists = await Gaming.findOne({
      $or: [
        { leaderRoll: roll },
        { p2roll: roll },
        { p3roll: roll },
        { p4roll: roll }
      ]
    });

    res.json({ exists: !!exists });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to check roll number",
      error: err
    });
  }
});



// UPDATE API
router.put('/gaming/update/:id', async (req, res) => {
  try {
    const updated = await Gaming.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false }

    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      message: "Gaming entry updated successfully",
      data: updated
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update entry",
      error: err
    });
  }
});

// DELETE API
router.delete('/gaming/delete/:id', async (req, res) => {
  try {
    await Gaming.findByIdAndDelete(req.params.id);

    res.json({
      message: "Gaming entry deleted successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete entry",
      error: err
    });
  }
});

module.exports = router;
