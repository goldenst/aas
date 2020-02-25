const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profiles");
const User = require("../../models/User");

// @Route     get  api/profile/me
// @des       get current user profile
// @access    Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user"
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile for this User" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error - P11 ");
  }
});

// @Route     POST  api/profile
// @des       Create or Update User profile
// @access    Private

router.post(
  "/",
  [
    auth,
    [
      check("cellPhone", "Emergencey Contact is required")
        .not()
        .isEmpty(),
      check("emerPhone", "Emergency Contact phone is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructoe profile
    const { cellPhone, emerContact, emerPhone, position } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (cellPhone) profileFields.cellPhone = cellPhone;
    if (emerContact) profileFields.emerContact = emerContact;
    if (emerPhone) profileFields.emerPhone = emerPhone;
    if (position) profileFields.position = position;

    try {
      let profile = await Profile.findOne({ user: req.user._id });

      if (profile) {
        // Update
        profile = await Profile.findByIdAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error - P22 ");
    }
  }
);

// @Route     GET  api/profile
// @des       get All profile
// @access    Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "cellPhone"
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error - P33 ");
  }
});

// @Route     GET  api/profile/user/:user.id
// @des       get  profile by user id
// @access    Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "cellPhone"]);

    if (!profile)
      return res.status(400).json({ msg: "profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).send("Server Error - P33 ");
  }
});

// @Route     DELETE  api/profile
// @des       DELETE profile, User
// @access    Private
router.delete("/", auth,  async (req, res) => {
  try {
    // remove profile
     await Profile.findOneAndRemove({ user: req.user.id})
     await User.findOneAndRemove({ _id: req.user.id})
    
    res.json({ msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error - P33 ");
  }
});

module.exports = router;
