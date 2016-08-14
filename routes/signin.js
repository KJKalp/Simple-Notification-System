/**
 * Created by KJain on 8/10/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

// GET Signin page.
router.get('/', function(req, res, next) {
    res.render('signin', {badCredentials: false});
});

//Check if user has enter correct username and password
function authenticateUser(username, password, callback){
    var col = mongo.collection('users');
    var query = { $or:
        [
            {username: username},
            {email: username}
        ],
        password: password
    };
    col.findOne(query, function(err, user){
        callback(err, user);
    });
}

router.post('/', function(req, res){
    //Extracting username and password obtained from html form
    var username = req.body.username;
    var password = req.body.password;

    authenticateUser(username, password, function(err, user){
        if (user) {
            req.session.username = user.username;
            res.redirect('/documents');
        }
        else {
            res.render('signin', {badCredentials: true});
        }
    });
});

module.exports = router;