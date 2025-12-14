const express = require("express");
const Hackathon = require("../models/hackathon");

const router = express.Router();

/* -----------------------------------------
   👉 CREATE Hackathon Entry
----------------------------------------- */
router.post("/hackathon/register", async (req, res) => {
  try {
    const data = req.body || {};

    // ================= BASIC REQUIRED CHECK =================
    if (!data.p1_name || !data.p1_roll || !data.p1_mobile) {
      return res.status(400).json({
        message: "Leader Name, Roll and Mobile are required!"
      });
    }

    // ================= DUPLICATE CHECKS =================

    // 1️⃣ Leader Roll duplicate
    const leaderRollExists = await Hackathon.findOne({
      p1_roll: data.p1_roll
    });
    if (leaderRollExists) {
      return res.status(400).json({
        message: "Duplicate Roll Number Not Allowed!"
      });
    }

    // 2️⃣ Leader Mobile duplicate
    const leaderMobileExists = await Hackathon.findOne({
      p1_mobile: data.p1_mobile
    });
    if (leaderMobileExists) {
      return res.status(400).json({
        message: "Duplicate Mobile Number Not Allowed!"
      });
    }

    // 3️⃣ Participant 2 Roll duplicate (ONLY if exists)
    if (typeof data.p2_roll === "string" && data.p2_roll.trim() !== "") {
      const p2Exists = await Hackathon.findOne({
        $or: [
          { p1_roll: data.p2_roll },
          { p2_roll: data.p2_roll },
          { p3_roll: data.p2_roll }
        ]
      });

      if (p2Exists) {
        return res.status(400).json({
          message: "Participant 2 Roll Number Already Registered!"
        });
      }
    } else {
      // IMPORTANT: remove empty optional fields
      delete data.p2_roll;
      delete data.p2_name;
    }

    // 4️⃣ Participant 3 Roll duplicate (ONLY if exists)
    if (typeof data.p3_roll === "string" && data.p3_roll.trim() !== "") {
      const p3Exists = await Hackathon.findOne({
        $or: [
          { p1_roll: data.p3_roll },
          { p2_roll: data.p3_roll },
          { p3_roll: data.p3_roll }
        ]
      });

      if (p3Exists) {
        return res.status(400).json({
          message: "Participant 3 Roll Number Already Registered!"
        });
      }
    } else {
      // IMPORTANT: remove empty optional fields
      delete data.p3_roll;
      delete data.p3_name;
    }

    // ================= SAVE =================
    const newEntry = new Hackathon(data);
    await newEntry.save();

    res.status(201).json({
      message: "Hackathon Registration Successful!",
      data: newEntry
    });

  } catch (err) {
    console.error("REGISTER ERROR 👉", err);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* -----------------------------------------
   👉 GET All Hackathon Entries
----------------------------------------- */
router.get("/hackathon/list", async (req, res) => {
  try {
    const entries = await Hackathon.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------
   👉 UPDATE Hackathon Entry
----------------------------------------- */
router.put("/hackathon/update/:id", async (req, res) => {
  try {
    const data = req.body || {};

    // OPTIONAL FIELDS CLEANUP (same rule)
    if (!data.p2_roll) {
      delete data.p2_roll;
      delete data.p2_name;
    }

    if (!data.p3_roll) {
      delete data.p3_roll;
      delete data.p3_name;
    }

    const updated = await Hackathon.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Hackathon Entry Updated Successfully!",
      data: updated
    });

  } catch (err) {
    console.error("UPDATE ERROR 👉", err);
    res.status(400).json({ message: err.message });
  }
});

/* -----------------------------------------
   👉 DELETE Hackathon Entry
----------------------------------------- */
router.delete("/hackathon/delete/:id", async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);

    res.json({
      message: "Hackathon Entry Deleted Successfully!"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete entry"
    });
  }
});

module.exports = router;
