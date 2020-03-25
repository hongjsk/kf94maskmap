var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/static'));

require('./api')(app)

const USE_CURRENT_LOCATION = (process.env.USE_CURRENT_LOCATION ? true:false)
console.log('USE_CURRENT_LOCATION: ' + USE_CURRENT_LOCATION)

app.use('/', function(req, res, next) {
    res.render('index.html', Object.assign({}, {
        USE_CURRENT_LOCATION: USE_CURRENT_LOCATION
    }));
});

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
