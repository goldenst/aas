const express = require('express')
const router = express.Router()


// @Route     get  api/drivers
// @des       Test Route
// @access    Public
router.get('/', (req, res) => res.send('Driver Route'))

module.exports = router