const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('message/:parentId', function(req, res, next) {
  res.send(200, { title: 'Express' });
});

module.exports = router;