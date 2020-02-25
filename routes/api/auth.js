const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @Route     get  api/auth
// @des       Test Route
// @access    Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error - A11 ");
  }
});

// @Route     POST api/auth
// @des       auth user & get token
// @access    private
router.post(
  "/",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("error in user,js POST api/user");
      // this return stops error for UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]:
      return res.status(400).json({ errors: errors.array() });
    }

    // destructer req.body
    const { email, password } = req.body;

    try {
      // see if user exisits
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentails - I11" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentails - I22" }] });
      }

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
      res.status(500).send("Server Error - A22 ");
    }
  }
);

module.exports = router;
