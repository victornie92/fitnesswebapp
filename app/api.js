//dependencies
var express = require('express');
var router = express.Router();


//Models
var ExerciseProgram = require('./models/exerciseprogram');
var traningslog = require ('./models/trainingslog');
var user = require('./models/user');

//routes
ExerciseProgram.methods(['get', 'put', 'post', 'delete']);
ExerciseProgram.register(router, '/exerciseprogram')
traningslog.methods(['get', 'post', 'delete']);
traningslog.register(router, '/trainingslog')
user.methods(['post','put']);
user.register(router, '/user')


//return router
module.exports = router;
