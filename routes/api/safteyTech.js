const express = require('express')
const router = express.Router()


// @Route     get  api/Saftey
// @des       Test Route
// @access    Public
router.get('/', (req, res) => res.send('Saftey Tech Route'))

module.exports = router