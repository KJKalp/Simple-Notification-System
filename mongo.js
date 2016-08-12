/**
 * Created by KJain on 8/11/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

module.exports = {
    connect: function(url, callback){
        MongoClient.connect(url, function(err, _db){
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }
            db = _db;
            connected = true;
            callback(db);
        });
    },
    collection: function(name){
        if (!connected) {
            throw new Error('Must connect to Mongo before calling "collection"');
        }
        return db.collection(name);
    }
};