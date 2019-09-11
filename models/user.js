const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

const ObjectId = mongodb.ObjectId;

class User {

    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    addToCart(product) {
        const cartP = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQ = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartP > -1) {
            newQ = this.cart.items[cartP].quantity + 1;
            updatedCartItems[cartP].quantity = newQ;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(this._id),
                quantity: newQ
            });
        }
        const updatedCart = {items: updatedCartItems};

        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            {$set: {cart: updatedCart}}
        );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db.collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(p => {
            return p.productId.toString() !== productId.toString();
        });

        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            {$set: {cart: {item: updatedCartItems}}}
        );
    }

    save() {
        const db = getDb();

        return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new ObjectId(id)})
            .then(user => {
                return user;
            }).catch(err => {
                console.log(err)
            });
    }
}

module.exports = User;
