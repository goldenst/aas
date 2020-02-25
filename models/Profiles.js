const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  cellPhone: {
    type: String,
    required: true
  },
  emerContact: {
    type: String,
    required: true
  },
  emerPhone: {
    type: String,
    required: true
  },
  position: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);