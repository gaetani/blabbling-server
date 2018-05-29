const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/:parentId', function(req, res, next) {
  res.send(200, { title: 'Express' });
});
router.put('/:parentId/:messageId', function(req, res, next) {
    res.send(200, { title: 'Express' });
});

router.delete('/:parentId/:messageId', function(req, res, next) {
    res.send(200, { title: 'Express' });
});


module.exports = router;
