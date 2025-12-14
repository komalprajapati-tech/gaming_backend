const mongoose = require("mongoose");

// Roll format: 25BCA125 / 24bit112 / 21BIT007
const rollPattern = /^[0-9]{2}(BCA|bca|BIT|bit)[0-9]{3}$/;

// Indian mobile number: 10 digits, starts with 6–9
const mobileRegex = /^[6-9]\d{9}$/;

const HackathonSchema = new mongoose.Schema({

  // ================= PARTICIPANT 1 (MANDATORY) =================
  p1_name: {
    type: String,
    required: [true, "Leader name is required"],
    trim: true
  },

  p1_roll: {
    type: String,
    required: [true, "Leader roll is required"],
    unique: true,              // ✅ only mandatory field is unique
    uppercase: true,
    trim: true,
    validate: {
      validator: v => rollPattern.test(v),
      message: "Leader roll must be like 25BCA125 or 25bit112"
    }
  },

  p1_mobile: {
    type: String,
    required: [true, "Leader mobile is required"],
    unique: true,
    trim: true,
    validate: {
      validator: v => mobileRegex.test(v),
      message: "Mobile must be 10 digits starting with 6–9"
    }
  },

  // ================= PARTICIPANT 2 (OPTIONAL) =================
  p2_name: {
    type: String,
    trim: true
  },

  p2_roll: {
    type: String,
    uppercase: true,
    trim: true,
    validate: {
      validator: v => !v || rollPattern.test(v),
      message: "Participant 2 roll format invalid"
    }
  },

  // ================= PARTICIPANT 3 (OPTIONAL) =================
  p3_name: {
    type: String,
    trim: true
  },

  p3_roll: {
    type: String,
    uppercase: true,
    trim: true,
    validate: {
      validator: v => !v || rollPattern.test(v),
      message: "Participant 3 roll format invalid"
    }
  },

  // ================= PROJECT DEFINITION =================
  definition: {
    type: String,
    required: [true, "Project definition is required"],
    trim: true,
    minlength: [10, "Definition must be at least 10 characters"]
  }

}, { timestamps: true });

/*
  ================= CONDITIONAL VALIDATION =================
  Rule:
  - If name exists → roll must exist
  - If roll exists → name must exist
*/
HackathonSchema.pre("validate", function () {

  // Participant 2
  if ((this.p2_name && !this.p2_roll) || (!this.p2_name && this.p2_roll)) {
    throw new Error("Participant 2: Name and Roll must be together");
  }

  // Participant 3
  if ((this.p3_name && !this.p3_roll) || (!this.p3_name && this.p3_roll)) {
    throw new Error("Participant 3: Name and Roll must be together");
  }

});

module.exports = mongoose.model("Hackathon", HackathonSchema);
