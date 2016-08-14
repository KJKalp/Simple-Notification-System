/**
 * Created by KJain on 8/11/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

var docs = [];
var subscribed;
var notifications;
/* GET Documents page. */
router.get('/', function(req, res, next) {
    notifications = [];
    subscribed = false;
    mongo.collection('subscribers').findOne({username: req.session.username}, function(err, subs){
        if(subs) {
            subscribed = true;
        }
        mongo.collection('documents').find({}).toArray(function(err, _docs) {
            docs = _docs;
            mongo.collection('users').findOne({'username': req.session.username}, function (err, user) {
                for (var i = user.notifications.length - 1; i > 0; --i) {
                    mongo.collection('notifications').findOne({_id: user.notifications[i]}, function (err, notification) {
                        notifications.push(notification);
                    });
                }
                if (user.notifications.length) {
                    mongo.collection('notifications').findOne({_id: user.notifications[0]}, function (err, notification) {
                        notifications.push(notification);
                        res.render('documents', {
                            docs: docs,
                            subscribed: subscribed,
                            error: null,
                            notifications: notifications
                        });
                    });
                }
                else {
                    res.render('documents', {
                        docs: docs,
                        subscribed: subscribed,
                        error: null,
                        notifications: notifications
                    });
                }
            });
        });
    });
});

function createDocument(name, fname, lname, age, mobile, callback) {
    var col = mongo.collection('documents');
    col.findOne({name: name}, function(err, document) {
       if (document) {
           var err = 'Document with this name already exists. Please cahnge the name';
           callback(err);
       }
       else if (name == "" || fname == "" || lname == "" || age == "" || mobile == "") {
           var err = "Fields cannot be empty";
           callback(err);
       }
       else {
           obj = {
               name: name,
               fname: fname,
               lname: lname,
               age: age,
               mobile: mobile,
               subscribers: []
           };
           col.insertOne(obj, function (err, document) {
               col.createIndex({name: 1});
               callback(err, document);
           });
       }
    });
}

router.post('/', function(req, res) {
    if(req.body.subscribe == "true")
        subscribe(req, res);
    else {
        var name = req.body.name;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var age = req.body.age;
        var mobile = req.body.mobile;

        createDocument(name, fname, lname, age, mobile, function (err, doc) {
            if (err) {
                res.render('documents', {
                    docs: docs,
                    subscribed: subscribed,
                    error: err,
                    notifications: notifications
                });
            }
            else {
                res.redirect('/documents');
            }
        });
    }
})

function subscribe(req, res) {
    var col = mongo.collection('subscribers');
    col.insertOne({username: req.session.username}, function(err, subscriber) {
        col.createIndex({username: 1});
        res.redirect('/documents');
    });
}

module.exports = router;