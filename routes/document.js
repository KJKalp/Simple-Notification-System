/**
 * Created by KJain on 8/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

/* GET Single Document. */
router.get('/', function(req, res, next) {
    var col = mongo.collection('documents');

    //To find the document name which is opened
    var name_array = req.originalUrl.split('/');
    var name = name_array[name_array.length - 1];

    //Extract the document from the database
    col.findOne({name: name}, function(err, doc) {
        res.render('document', {doc: doc});
    })
});

module.exports = router;