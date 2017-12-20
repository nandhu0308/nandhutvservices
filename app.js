var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

var connection = require('./db');
var UserRouter = require('./user/routers/user-router');

app.use('/user', UserRouter);

app.listen(3000, function () {
    console.log('Connection success');  
    connection.sync({
        force: false,
        alter: false
    }).then(function() {
        console.log('DB Sync Success...');
    }).catch(err => {
        console.log('DB Sync Failed...');
        console.log(err);
    });
});