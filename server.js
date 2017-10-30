let express = require('express');
let app = express();
let port = process.env.PORT || 8083;
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');

require('./app/routes.js')(app);

app.use(express.static(__dirname + '/view/res'));
app.listen(port);
console.log('Service is running on port: ' + port);
