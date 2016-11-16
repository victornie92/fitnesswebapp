// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our exerciseprogram model
var exerciseprogramSchema = mongoose.Schema({

    exerciseprogram        : {
        exercise    : String,
        description : String,
        setNum      : Number,
        repsOrTime  : String
    }
});

// create the model for exercise and expose it to our app
var exercise = mongoose.model('Exerciseprogram', exerciseprogramSchema);

// make this available in the Node applications
module.exports = exercise;