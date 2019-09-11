const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://user:Yf4C3AFAhDP8WFsD@cluster0-l2fui.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected');
            _db = client.db('test');
            callback();
        })
        .catch(err => {
            console.log('\nERROOOOOOR\n' + err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



