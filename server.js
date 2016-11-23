var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');



var gracefulShutdown;
//var dbURI = require('./config/database.js');

// =====================================================================
//Til mlab
var dbURI = 'mongodb://fitnesswebappdb:fitnesswebappdb@ds013545.mlab.com:13545/heroku_rhnsjtgw'

//Til lokalt
//var dbURI = 'mongodb://localhost/FitnessDB'

// =====================================================================

// configuration ===============================================================
mongoose.connect(dbURI); // connect to our database

// Monitoring for successful connection through Mongoose
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

// Checking for connection error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// Checking for disconnection event
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

// Close Mongoose connection, passing through an anonymous function to run when closed
// Define function to accept message and callback function

gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
    // Output message and call callback when Mongoose connection is closed
  });
};
// Listen for SIGUSR2, which is what nodemon uses
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
      // Send message to graceful- Shutdown and callback to kill process, emitting SIGUSR2 again
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Listen for SIGINT emitted on application termination
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
      //Send message to gracefulShutdown and callback to exit Node process
    process.exit(0);
  });
});

// Listen for SIGTERM emitted when Heroku shuts down process
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
      //Send message to gracefulShutdown and callback to exit Node process
    process.exit(0);
  });
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.json());
//routes for restful api
app.use('/api', require('./app/api'));

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'jade'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);