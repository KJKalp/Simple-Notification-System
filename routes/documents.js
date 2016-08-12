/**
 * Created by KJain on 8/11/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

var docs = [];
/* GET Documents page. */
router.get('/', function(req, res, next) {
    var col = mongo.collection('documents');
    col.find({}).toArray(function(err, _docs) {
        docs = _docs;
        res.render('documents', {
            docs: docs,
            error: null
        });
    })
});

function createDocument(name, fname, lname, age, mobile, callback) {
    col = mongo.collection('documents');
    col.findOne({name: name}, function(err, document) {
       if (document) {
           var err = 'Document with this name already exists. Please cahnge the name';
           callback(err);
       }
       else if (name == null || fname == null || lname == null || age == null || mobile == null) {
           var err = "Fields cannot be empty";
           callback(err);
       }
       else {
           obj = {
               name: name,
               fname: fname,
               lname: lname,
               age: age,
               mobile: mobile
           };
           col.insertOne(obj, function (err, document) {
               col.createIndex({name: 1});
               callback(err, document);
           });
       }
    });
}

router.post('/', function(req, res) {
    var name = req.body.name;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var age = req.body.age;
    var mobile = req.body.mobile;

    createDocument(name, fname, lname, age, mobile, function(err, doc){
        if (err) {
            res.render('documents', {
                docs: docs,
                error: err
            });
        }
        else {
            res.redirect('/documents');
        }
    });
})

module.exports = router;