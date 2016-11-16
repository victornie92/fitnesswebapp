// load the things we need
var mongoose = require('mongoose');

// define the schema for our exercise model - not created again
var exerciseprogramSchema = mongoose.Schema({
    exerciseprogram        : {
        exercise    : String,
        description : String,
        setNum      : Number,
        repsOrTime  : String
    }
});

// define the schema for traningslog model
var traningSchema = mongoose.Schema({   

    training            : {
        trainingslog    : [exerciseprogramSchema]
    }
});

// create the model for traningslog and expose it to our app
var traningslog = mongoose.model('Traningslog', traningSchema);

// make this available in the Node applications
module.exports = traningslog;