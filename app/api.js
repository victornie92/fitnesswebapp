//dependencies
var express = require('express');
var router = express.Router();


//Models
var ExerciseProgram = require('./models/exerciseprogram');
var traningslog = require ('./models/trainingslog');

//routes
ExerciseProgram.methods(['get', 'put', 'post', 'delete']);
ExerciseProgram.register(router, '/exerciseprogram')
traningslog.methods(['get', 'put', 'post', 'delete']);
traningslog.register(router, '/trainingslog')

//return router
module.exports = router;
