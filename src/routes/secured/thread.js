const express = require('express');
const router = express.Router();

const {Category, Topic, Message, Thread, User} = require('../../model/index');


/* GET home page. */
router.use('/:parentId', async (req, res, next) => {
  const topic = await Topic.findOne({_id: req.params.parentId});
  if(!topic){
    return res.status(404).send('Topic not found');
  }
  req.body.topic = topic;
  req.body.parentId = topic.id;
  next();
});
router.get('/:parentId', function(req, res, next) {
  Thread.paginate({'parentId': req.params.parentId}, req.paginate).then((threads) => {  
    return res.status(200).send(threads);
  }).catch(err => res.status(500).send(err));
});
router.get('/:parentId/:threadId', function(req, res, next) {
  Thread.findById(req.params.threadId).then((thread) => {  
    return res.status(200).send(thread);
  }).catch(err => res.status(500).send(err));
});
router.post('/:parentId', (req, res, next) =>{
  const threadNewObj = new Thread(req.body);  
  threadNewObj.save(err => {  
      if (err) return res.status(500).send(err);
      return res.status(200).send(threadNewObj);
  });
});
router.put('/:parentId/:threadId', function(req, res, next) {
  
  Thread.findByIdAndUpdate(  
    // the id of the item to find
    req.params.threadId,

    // the change to be made. Mongoose will smartly combine your existing 
    // document with this change, which allows for partial updates too
    req.body,

    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
    {new: true},
    // the callback function
    (err, topic) => {
      // Handle any possible database errors
          if (err) return res.status(500).send(err);
          return res.send(topic);
    });
});

router.delete('/:parentId/:threadId', (req, res, next) => {
      
  Thread.findByIdAndRemove(req.params.threadId, (err, thread) => {  
           // As always, handle any potential errors:
          if (err) return res.status(500).send(err);
          // We'll create a simple object to send back with a message and the id of the document that was removed
          // You can really do this however you want, though.
          const response = {
              message: "Thread successfully deleted",
              id: thread._id
          };
          return res.status(200).send(response);
      });
});


module.exports = router;
