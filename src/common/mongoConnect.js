
const mongoose = require('mongoose');

connectMongoDatabase = (success, error) => {

        mongoose.connect('mongodb://mongo-db:27017/blabbingbeer');

        mongoose.connection.on('error', error);
        mongoose.connection.once('open', success);
}

module.exports = {
    connectMongoDatabase: connectMongoDatabase
};

