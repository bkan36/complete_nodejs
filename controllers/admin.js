const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product
        .save()
        .then(result => {
            console.log('Created');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode)
        return res.redirect('/');

    const pid = req.params.id;
    Product.findById(pid)
        .then(product => {
            if (!product)
                return res.redirect('/');

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        }).catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.pid;
    const upTitle = req.body.title;
    const upPrice = req.body.price;
    const upImgUrl = req.body.imageUrl;
    const upDes = req.body.description;
    const product = new Product(upTitle, upPrice, upDes, upImgUrl, id);
    product
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const pid = req.body.pid;
    Product.deleteById(pid)
        .then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
};
