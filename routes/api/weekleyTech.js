const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Drivers = require("../../models/Drivers");
const Weights = require("../../models/Weights");

// @Route     get  api/weekley
// @des       Create a weight
// @access    Private
router.get(
  "/",
  auth,
  [
    check("driver", "Driver is required")
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
       //get user 
    const user = await (await User.findById(req.user.id)).isSelected('-password')

    const newWeights = new Weights({
      user: req.user.id,
      driver: req.body.driver,
      // raceNum: req.body.raceNum,
      // qualifingWeight: req.body.qualifingWeight,
      // qualifyingLeft: req.body.qualifyingLeft,
      // preRaceWeight: req.body.preRaceWeight,
      // preRaceLeft: req.body.preRaceLeft,
      // midRaceWeight: req.body.midRaceWeight,
      // midRaceLeft: req.body.midRaceLeft
    })

    const weights = await newWeights.save()

    res.json(weights)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error - W11 ");
    }
   
  }
);

module.exports = router;
