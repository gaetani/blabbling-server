const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';


const fs = require('fs');
const scraps = JSON.parse(fs.readFileSync('db/scraps.json', 'utf8'));
const topics = JSON.parse(fs.readFileSync('db/topics.json', 'utf8'));
const R = require('ramda');
const uuidv4 = require('uuid/v4');
const moment = require('moment');


// Database Name
const dbName = 'blabbingbeer';
let db;
const users = {};
const talks = {};
// Use connect method to connect to the server
MongoClient.connect(url).then(client => {
    console.log("Connected successfully to server");
    db = client.db(dbName);
    return db;
}).then(db => {
    const _title = [];
    const _topc = R.flatten(R.map(t => {
        const idP = uuidv4();
        _title.push({
            _id: idP,
            name: t.name,
        });
        return [t.selection2? R.map(tt => {
            const idPP  = uuidv4();
            const parents = [idP, idPP];
            return [{
                _id: idPP,
                categoryId: idP,
                name: tt.name,
                description: tt.description
            }, tt.selection6 ? R.map(ttt => {
                talks[ttt.name] = {
                    _id: uuidv4(),
                    parentId: idPP,
                    name: ttt.name
                };

                return talks[ttt.name];
            }, tt.selection6) : []]
        }, t.selection2) : []];
    }, topics.selection1 ));
    return db.collection('categories').insertMany(_title).then(() => db.collection('forummessages').insertMany(_topc));
}).then(r => {
    console.log(topics);
    let sll = [];
    sll.push(scraps.selection1[0].selection2[0].selection6);
    sll.push(scraps.selection1[0].selection2[1].selection6);
    sll = R.flatten(sll);

    scraps.selection1[0].selection2[0].selection6.push(scraps.selection1[0].selection2[1].selection6);
    const avatars = ['http://emilcarlsson.se/assets/mikeross.png',
        'http://emilcarlsson.se/assets/harveyspecter.png',
        'http://emilcarlsson.se/assets/rachelzane.png',
        'http://emilcarlsson.se/assets/jessicapearson.png',
        'http://emilcarlsson.se/assets/haroldgunderson.png',
        'http://emilcarlsson.se/assets/katrinabennett.png',
        'http://emilcarlsson.se/assets/louislitt.png',
        'http://emilcarlsson.se/assets/donnapaulsen.png',
        'http://emilcarlsson.se/assets/danielhardman.png',
        'http://emilcarlsson.se/assets/jonathansidwell.png',
        'http://emilcarlsson.se/assets/charlesforstman.png'];
    let avatar = 0;
    const _scrap = R.flatten(R.map(it => {
        const id = talks[it.name];
        return !id ? []: R.map( itt => {
            const userId = users[itt.user]? users[itt.user]._id: uuidv4();


            users[itt.user] = {
                _id: userId,
                name: itt.user,
                avatar: avatars[avatar]
            };

            avatar = avatar >= avatars.length -1? 0 : ++avatar;
            return {
                _id: uuidv4(),
                parentId: id._id,
                parents: [id.parentId,id._id],
                datePost: moment(itt.datePost, "YYYY-MM-DD hh:mm a").toDate(),
                message: itt.message,
                userId: userId
            }
        }, it.selection9);
    }, sll));

    // Insert multiple documents
    return db.collection('forummessages').insertMany(_scrap);
    console.log(scraps);
}).then(() => {
    return db.collection('users').insertMany(R.values(users));
}).catch(console.log);


