var levelup = require('level');

var db;
var index = 0;

exports.init = function(path) {
    db = levelup(path);
}

exports.put = function(key, value, callback) {
    db.put(key, JSON.stringify(value), callback);
};

exports.get = function(key, callback) {
    db.get(key, function(err, value){
        if(err){
            callback(err)
        } else {
            callback(null, JSON.parse(value))
        }
        callback = null;
    });
}

exports.getAll = function(callback) {
    var result = [];
    db.createReadStream()
        .on('data', function(data) {
            result.push(JSON.parse(data.value));
        })
        .on('error', function(err) {
            callback(err);
            callback = null;
        })
        .on('end', function() {
            callback(null, result);
            callback = null;
        });
}