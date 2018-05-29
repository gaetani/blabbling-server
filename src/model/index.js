const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    _id: { type: String, default: uuidv4() },
    name: { type: String, index: { unique: true }},
    avatar: String,
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    const user = this;

// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

// generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


UserSchema.plugin(mongoosePaginate);


const CategorySchema = new Schema({
    _id: { type: String, default: uuidv4() },
    name: String
});

CategorySchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);

const options = { discriminatorKey: 'typeMessage' };

const ForumMessageSchema = new Schema({
    _id: { type: String, default: genUUID= ()=> {
        const id =uuidv4();
        return id;
    } },
    name: String,
}, options);

ForumMessageSchema.plugin(mongoosePaginate);



const ForumMessage = mongoose.model('ForumMessage', ForumMessageSchema);
const Topic = ForumMessage.discriminator('Topic', new Schema({
    description: String,
    categoryId: { type: String, ref: 'Category' }
}).plugin(mongoosePaginate));

const Thread = ForumMessage.discriminator('Thread', new Schema({
    parentId: { type: String, ref: 'ForumMessage' }
}).plugin(mongoosePaginate));

const Message = ForumMessage.discriminator('Message', new Schema({
    parentId: { type: String, ref: 'ForumMessage' },
    parents: [{ type: String, ref: 'ForumMessage' }],
    datePost: Date,
    message: String,
    userId: { type: String, ref: 'User' },
}).plugin(mongoosePaginate));

mongoose.set('debug', true);

module.exports = { User, Category, ForumMessage, Topic, Thread, Message };