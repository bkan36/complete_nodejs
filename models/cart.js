const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, prodPrice) {
        // Fetch previouscart
        fs.readFile(p, (err, filecontent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(filecontent)
            }
            // Analyze the cart
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProd;
            if (existingProduct) {
                updatedProd = {...existingProduct};
                updatedProd.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProd;
            } else {
                updatedProd = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProd];
            }
            cart.totalPrice = cart.totalPrice + +prodPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    }

    static deleteCart(id, price) {
        fs.readFile(p, (err, filecontent) => {
            if (err)
                return;
            const upCart = {...JSON.parse(filecontent)};
            const product = upCart.products.find(prod => prod.id === id);
            const productQty = product.qty;
            upCart.products = upCart.products.filter(prod => prod.id !== id);
            upCart.totalPrice -= productPrice * productQty;

            fs.writeFile(p, JSON.stringify(upCart), err => {
                console.log(err);
            });
        });
    }

    static getProducts (cb) {
        fs.readFile(p, (err, filecontent) => {
            const cart = JSON.parse(filecontent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}
