const express = require('express');
const router = express.Router();
const user = require('./users');
const message = require('./message');
const forum = require('./forum');
const thread = require('./thread');
const topic = require('./topic');

/* FORUM ROUTE */
router.use('/forum', forum);
/* USER ROUTE */
router.use('/user', user);
/* MESSAGE ROUTE */
router.use('/message', message);
/* THREAD ROUTE */
router.use('/thread', thread);
/* TOPIC ROUTE */
router.use('/topic', topic);

module.exports = router;
