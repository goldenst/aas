const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @Route     POST api/user
// @des       Register user
// @access    Public
router.post(
  "/",
  [
    check("name", "Name is Required")
      .not()
      .isEmpty(),
    check("email", "Please Include a Valid Email").isEmail(),
    check(
      "password",
      "Please enter a Password with 6 or more Characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("error in user,js POST api/user");
      // this return stops error for UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]:
      return res.status(400).json({ errors: errors.array() });
    }

    // destructer req.body
    const { name, email, password } = req.body;

    try {
      // see if user exisits
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already Exists" }] });
      }

      // get gravitar

      user = new User({
        name,
        email,
        password
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // return jwt
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error - U22 ");
    }
  }
);

module.exports = router;
