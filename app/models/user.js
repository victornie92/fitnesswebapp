/*
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model

var userSchema = mongoose.Schema({

    local           : {
        email       : String,
        password    : String,
    }
});

// methods ==================
// generating a hash

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app

var user = mongoose.model('User', userSchema);

module.exports = user;
*/

//dependencies
var restful = require ('node-restful');
var mongoose = restful.mongoose;
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model

var userSchema = new mongoose.Schema({


        email       : String,
        password    : String,

});

// methods ==================
// generating a hash

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//module.exports
module.exports = restful.model('User', userSchema);