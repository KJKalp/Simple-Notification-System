/**
 * Created by KJain on 8/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

var name;
/* GET Single Document. */
router.get('/', function(req, res, next) {
    var col = mongo.collection('documents');

    //To find the document name which is opened
    var urlArray = req.originalUrl.split('/');
    name = urlArray[urlArray.length - 1];

    //Extract the document from the database
    col.findOne({name: name}, function(err, doc) {
        res.render('document', {doc: doc});
    })
});

router.post('/', function(req, res) {
    fname = req.body.fname;
    lname = req.body.lname;
    age = req.body.age;
    mobile = req.body.mobile;
    var col = mongo.collection('documents');
    col.findOne({name: name}, function(err, doc) {
        var cnt = 0;
        if(fname != doc.fname) {
            cnt++;
            doc.fname = fname;
        }
        if(lname != doc.lname) {
            cnt++;
            doc.lname = lname;
        }
        if(age != doc.age) {
            cnt++;
            doc.age = age;
        }
        if(mobile != doc.mobile) {
            cnt++;
            doc.mobile = mobile;
        }
        if(cnt) {
            col.updateOne({name: name}, {$set: {
                fname: fname,
                lname: lname,
                age: age,
                mobile: mobile
            }}, function(err, result) {});
        }
        res.redirect('/documents/' + name);
    });
});

router.post('/subscribe', function(req, res) {
    console.log('Subscribed');
});

module.exports = router;