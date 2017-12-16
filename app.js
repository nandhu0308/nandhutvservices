var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Connection success');  
});