const mongoose = require("mongoose");

const WeightsSchema = new mongoose.Schema({
  driver: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  raceNum: {
    type: String
    
  },
  qualifingWeight: {
    type: String
    
  },
  qualifyingLeft: {
    type: String
    
  },
  preRaceWeight: {
    type: String
    
  },
  preRaceLeft: {
    type: String
  
  },
  midRaceWeight: {
    type: String
    
  },
  midRaceLeft: {
    type: String
    
  }
});

module.exports = Weights = mongoose.model("weights", WeightsSchema);