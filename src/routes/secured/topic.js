const express = require('express');
const router = express.Router();

const {Category, Topic, Message, Thread, User} = require('../../model/index');


/* GET home page. */
router.get('/', function(req, res, next) {
  Topic.paginate({}, req.paginate).then((categories) => {  
    // send the list of all topic in database 
    return res.status(200).send(categories);
  }).catch(err => res.status(500).send(err));
});
router.use('/:categoryId', async (req, res, next) => {
  const category = await Category.findOne({_id: req.params.categoryId});
  if(!category){
    return res.status(404).send('Category not found');
  }
  req.body.category = category;
  req.body.categoryId = category.id;
  next();
});
router.get('/:categoryId', function(req, res, next) {
  Topic.paginate({'categoryId': req.params.categoryId}, req.paginate).then((categories) => {  
    // send the list of all topic in database with category id equals parameter
    return res.status(200).send(categories);
  }).catch(err => res.status(500).send(err));
});
router.get('/:categoryId/:topicId', function(req, res, next) {
  Topic.findById(req.params.topicId).then((topic) => {  
    // send the list of all topic in database with category id equals parameter
    return res.status(200).send(topic);
  }).catch(err => res.status(500).send(err));
});
router.post('/:categoryId', (req, res, next) =>{
  const topicNewObj = new Topic(req.body);  
  topicNewObj.save(err => {  
      if (err) return res.status(500).send(err);
      return res.status(200).send(topicNewObj);
  });
});
router.put('/:categoryId/:topicId', function(req, res, next) {
  
  Topic.findByIdAndUpdate(  
    // the id of the item to find
    req.params.topicId,

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

router.delete('/:categoryId/:topicId', (req, res, next) => {
      
    Topic.findByIdAndRemove(req.params.topicId, (err, topic) => {  
           // As always, handle any potential errors:
          if (err) return res.status(500).send(err);
          // We'll create a simple object to send back with a message and the id of the document that was removed
          // You can really do this however you want, though.
          const response = {
              message: "Topic successfully deleted",
              id: topic._id
          };
          return res.status(200).send(response);
      });
});


module.exports = router;
