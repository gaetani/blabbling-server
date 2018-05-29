const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {Category, Topic, Message, Thread, User} = require('../../model/index');

const P = require('bluebird');
const R = require('ramda');

const KEY = 'muBrq5H5AxnatgUZtkhMXWYSsnpG5kPnazd';

router.post('/', (req, res, next) => {
    const {name, avatar, email, password} = req.body;
    User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: password
    }).then(result => res.status(201).send());
});


router.post('/login', (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user || !user.comparePassword(req.body.password)) {
            res.status(401).json({ message: 'Authentication failed.' });
            return;
        }

        res.json({token: jwt.sign({ email: user.email, name: user.name, _id: user._id}, KEY)});
    });
});


router.use((req, res, next) => {
   if(req.headers && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer'){
        jwt.verify(req.headers.Authorization.split(' ')[1], KEY)
            .then((user) => {
               req.user = user;
               res.headers.Authorization = jwt.sign({ email: user.email, name: user.name, _id: user._id}, KEY);
               next();
            });
   } else {
       res.status(401).json({message: 'Unauthorized user!'});
   }
});

module.exports = router;
