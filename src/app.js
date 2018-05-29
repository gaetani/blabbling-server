const express = require('express');
const path = require('path');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const cors = require('cors');

const index = require('./routes/index');
const {connectMongoDatabase} = require('./common/mongoConnect');
const morgan = require('morgan');
const uuidv4 = require('uuid/v4');

function assignId (req, res, next) {
    req.id = uuidv4();
    next()
}
const app = express();
app.use(assignId);
app.use(morgan(':method :url :response-time'))
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/', index);
// catch 404 and forward to error handler


connectMongoDatabase(()=>console.log('MongoDB connected'),
                     ()=>console.error.bind(console, 'MongoDB connection error:'));


const secured = require('./routes/secured/index');
const forum = require('./routes/forum');
app.use((req, res, next) => {
    let {page, offset} = req.query;
    page = !page? 1: +page;
    offset = !offset? 0: +offset;
    const limit = 10;
    req.paginate = {
        page, offset, limit
    };
    next();
});

app.use('/secured', secured);
app.use('/forum', forum);

app.use((req, res, next) => {
    app;
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err.message);
    // render the error page
    res.status(err.status || 500);
    res.send('error');
});


const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Started environment listening at http://%s:%s', host, port);
    console.log('PRODUCER CONTEXT');
    console.log('BLABBING STARTED');
});

module.exports =server;