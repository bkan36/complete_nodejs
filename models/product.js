const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;


class Product {

    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db
                .collection('products')
                .updateOne({_id: this._id }, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(prodId)})
            .next()
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({_id: new mongodb.ObjectId(id)})
            .then(res => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Product;
