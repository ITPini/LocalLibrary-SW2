const express = require('express');
const router = express.Router();

/* GET catalog listing. */
router.get('/catalog', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;