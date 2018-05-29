const express = require('express');
const router = express.Router();
const {Category, ForumMessage, Topic, Message, Thread, User} = require('../model/index');

const P = require('bluebird');
const R = require('ramda');

// findByFilter: (filter, page) => P.resolve(db.collection(collection).find(filter).skip(MAX_RESULTS*(page-1)).limit(MAX_RESULTS).toArray()).then(results => R.map(result => new Model(result), results)),
/* GET users listing. */
router.get('/', function(req, res, next) {
  Category.aggregate([
      {
          $lookup:
              {
                  from: "forummessages",
                  localField: "_id",
                  foreignField: "categoryId",
                  as: "topics"
              }
      }
  ]).then(result => res.send(result));
});



/* GET users listing. */
router.get('/:parentId', function(req, res, next) {
    const page = !req.query.page? 1: +req.query.page;
    Topic.findOne({_id: req.params.parentId})
        .then( result => {
            return Thread.paginate({parentId: result}, { page: page, limit: 10 })
                .then( threads => result._doc.threads = threads.docs)
                .then( threads => res.send(threads));
        });

});

router.get('/breadcrumb/:id', async (req, res, next) => {
    const message = await ForumMessage.findOne({_id: req.params.id});
    let topic;
    if(message.typeMessage === 'Thread'){
        topic =  await Topic.findOne({_id: message.parentId});
    } else {
        topic = message;
    }

    const category = await Category.findOne( {_id : topic.categoryId});

    const result =  {
        category: {
            id: category._id,
            name: category.name
        },
        topic: {
            id: topic._id,
            name: topic.name,
            description: topic.description
        }
    };
    if(topic._id !== message._id) {
        result.thread = {
            id: message._id,
            name: message.name
        };
    }

    res.json(result);

});

const getUserIds = R.compose(R.uniq, R.pluck('userId'));

const indexByIdsUser = R.indexBy(R.prop('_id'));
router.get('/:parentId/messages/', function(req, res, next) {
    const page = !req.query.page? 1: +req.query.page;
    P.all([Thread.findOne({_id: req.params.parentId}), Message.paginate({parentId: req.params.parentId}, { page: page, limit: 10 })])
        .then( result => {
            const thread =  {
                thread: result[0]._doc,
                messages: result[1].docs
            };

            const userIds = getUserIds(result[1].docs);

            User.find({_id: { $in: userIds}}).then(result => {
                thread.user = indexByIdsUser(result);
                res.send(thread);
            });

    });
});



module.exports = router;
