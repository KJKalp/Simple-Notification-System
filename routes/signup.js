/**
 * Created by KJain on 8/10/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

/* GET Signup page. */
router.get('/', function(req, res, next) {
    res.render('signup', {error: null});
});

function createUser(username, email, password, password_confirmation, callback) {
    var col = mongo.collection('users');
    if (password !== password_confirmation) {
        var err = 'Passwords do not match';
        callback(err);
    }
    else {
        var query = { $or:
            [
                {username: username},
                {email: email}
            ]};
        var userObject = {
            username: username,
            email: email,
            password: password
        };

        // Make sure this username/email does not exist already
        col.findOne(query, function(err, user){
            if (user) {
                if(user.username == username)
                    err = 'Username you entered already exists';
                if(user.email == email)
                    err = 'Email you entered already exists';
                callback(err);
            } else {
                // Create a new user
                col.insertOne(userObject, function(err, user) {
                    //Indexing on the basis of username and email
                    col.createIndex({username: 1, email: 1});
                    callback(err, user.ops[0]);
                });
            }
        });
    }
}

router.post('/', function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;

    createUser(username, email, password, password_confirmation, function(err, user){
        if (err) {
            res.render('signup', {error: err});
        } else {
            req.session.username = user.username;
            res.redirect('/documents');
        }
    });
});

module.exports = router;