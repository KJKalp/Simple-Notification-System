/**
 * Created by KJain on 8/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

var name;
var subscribed;
/* GET Single Document. */
router.get('/', function(req, res, next) {
    subscribed = false;
    mongo.collection('subscribers').findOne({username: req.session.username}, function(err, subs){
        if(subs) {
            subscribed = true;
        }
    });

    var col = mongo.collection('documents');

    //To find the document name which is opened
    var urlArray = req.originalUrl.split('/');
    name = urlArray[urlArray.length - 1];

    //Extract the document from the database
    col.findOne({name: name}, function(err, doc) {
        if (!subscribed) {
            for(var i = 0; i < doc.subscribers.length; ++i) {
                if(doc.subscribers[i] == req.session.username) {
                    subscribed = true;
                    break;
                }
            }
        }
        var obj = {
            fname: doc.fname,
            lname: doc.lname,
            age: doc.age,
            mobile: doc.mobile
        };
        res.render('document', {
            doc: obj,
            subscribed: subscribed
        });
    })
});

router.post('/', function(req, res) {
    if(req.body.subscribe == "true")
        subscribe(req, res);
    else {
        fname = req.body.fname;
        lname = req.body.lname;
        age = req.body.age;
        mobile = req.body.mobile;
        var col = mongo.collection('documents');
        col.findOne({name: name}, function (err, doc) {
            var cnt = 0;
            var notification = "";
            if (fname != doc.fname) {
                cnt++;
                notification = "First name changed from " + doc.fname + " to " + fname;
            }
            if (lname != doc.lname) {
                cnt++;
                notification = "Last name changed from " + doc.lname + " to " + lname;
            }
            if (age != doc.age) {
                cnt++;
                notification = "Age changed from " + doc.age + " to " + age;
            }
            if (mobile != doc.mobile) {
                cnt++;
                notification = "Mobile Number changed from " + doc.mobile + " to " + mobile;
            }
            if (cnt) {
                col.updateOne({name: name}, {
                    $set: {
                        fname: fname,
                        lname: lname,
                        age: age,
                        mobile: mobile
                    }
                }, function (err, result) {
                });
                if (cnt > 1)
                    notification = cnt + " changes are made in " + name;
                else
                    notification = notification + " in " + name;
                console.log(notification);
            }
            res.redirect('/documents/' + name);
        });
    }
});

function subscribe(req, res) {
    var col = mongo.collection('documents');
    col.updateOne({name: name},
        {$addToSet: {subscribers: req.session.username}},
        function (err, result) {
            res.redirect('/documents/' + name);
        }
    );
}

module.exports = router;