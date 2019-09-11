const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail',
            {product: product, pageTitle: product.title, path: '/products'});
    }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const pid = req.body.pid;
    Product.findById(pid)
        .then(prod => {
            return req.user.addToCart(prod);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    /*
        let fetchedCart;
        let newQ = 1;
        req.user
            .getCart()
            .then(cart => {
                fetchedCart = cart
                return cart.getProducts({where: {id: pid}});
            })
            .then(prods => {
                let product;
                if (prods.length > 0)
                    product = prods[0];
                if (product) {
                    const oldQ = product.cartItem.quantity;
                    newQ = oldQ + 1;
                    return product;
                }
                return Product.findByPk(pid);
            })
            .then(prod => {
                return fetchedCart.addProduct(prod, {
                    through: {quantity: newQ}
                });
            })
            .then(() => {
                res.redirect('/cart');
            })
            .catch(err => console.log(err));
    */
};

exports.postCartDeleteProduct = (req, res, next) => {
    const pid = req.body.productId;
    req.user
        .deleteItemFromCart(pid)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = {quantity: product.cartItem.quantity}
                        return product;
                    }));
                })
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};
