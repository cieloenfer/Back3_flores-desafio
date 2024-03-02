const express = require('express');
const productRouter = require('./product');
const carritoRouter = require('./carrito');

const router = express.Router();

router.use('/api/products', productRouter);
router.use('/api/carts', carritoRouter);

module.exports = router;

