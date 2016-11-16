var user = require('../app/models/user');
var exerciseprogram =  require('../app/models/exerciseprogram');
var trainingslog =  require('../app/models/trainingslog');
var mongoose = require('mongoose');

module.exports = function(app, passport){

    //Home page (with login links)
    app.get('/', function(req, res) {
        res.render('index', {title: 'FitnessApp'}); // load the index.jade file
    });

    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', {title: 'FitnessApp', message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP ==============================
    // show the signup form
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // PROFILE SECTION =====================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        user.find({}, function(err, users) {
            res.render('profile', { title: 'FitnessApp', userlist : users });

        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // TRAININGLOG =========================
    app.get('/trainingslog',isLoggedIn, function(req, res) {
        trainingslog.find({}, function(err, tLog) {
            res.render('trainingslog', {title: 'FitnessApp', tLog : tLog})
        });

    });

    // REMOVE ALL trainingslogs
    app.post('/trainingslog/delete', function (req, res) {
       trainingslog.remove(function (err) {
            if (!err) {
            console.log("removed");
            return res.redirect('/trainingslog');
            } else {
            console.log(err);
            }
        });
    });

        // CREATE new trainingslog
    app.post('/trainingsprogram/logTraining', function(req, res, next) {

        exerciseprogram.find({}, function(err, exercise) {

            var newTrainingsLog = new trainingslog({
                training            : {
                    trainingslog    : exercise
                }
            });

            newTrainingsLog.save(function(err){
                if (err) {
                    // If it failed, return error            
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    console.log('Trainingslog saved successfully!');
                    res.redirect('/profile');
                }
            });
        });
    })

    // TRAININGPROGRAM ======================
    app.get('/trainingsprogram',isLoggedIn, function(req, res) {
        var allUsers;

        user.find({}, function(err, users) {
            allUsers = users
        });

        exerciseprogram.find({}, function(err, exerciseprogram){
            res.render('trainingsprogram', {title: 'FitnessApp', exercise : exerciseprogram, userlist : allUsers})
        });
        
    });

    // ADDNEWEXERCISE =======================
    app.get('/trainingsprogram/addnewexercise',isLoggedIn, function(req, res) {
        res.render('addnewexercise', {title: 'FitnessApp'})
    });

    // CREATE new exercise
    app.post('/trainingsprogram/addnewexercise', function(req, res, next) {

        var ex = req.body.exercise;
        var des = req.body.description;
        var se = req.body.setNum;
        var rep = req.body.repsOrTime;

        var newExercise = new exerciseprogram({
            exerciseprogram         : {
                exercise            : ex,
                description         : des,
                setNum              : se,
                repsOrTime          : rep
            }
        });

        newExercise.save(function(err){
            if (err) {
                // If it failed, return error            
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                console.log('Exercise saved successfully!');
                res.redirect('/trainingsprogram');
            }
        });
    });

    // REMOVE ALL EXERCISES
    app.post('/trainingsprogram/delete', function (req, res) {
       exerciseprogram.remove(function (err) {
            if (!err) {
            console.log("removed");
            return res.redirect('/trainingsprogram');
            } else {
            console.log(err);
            }
        });
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}