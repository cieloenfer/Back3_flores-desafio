const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    const data = await fs.readFile('carrito.json', 'utf-8');
    const carritos = JSON.parse(data);
    carritos.push(newCart);
    await fs.writeFile('carrito.json', JSON.stringify(carritos, null, 2));
    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    const carritos = JSON.parse(data);
    const carrito = carritos.find(c => c.id === cartId);
    if (carrito) {
      res.json(carrito.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    let carritos = JSON.parse(data);
    const index = carritos.findIndex(c => c.id === cartId);
    if (index !== -1) {
      const existingProductIndex = carritos[index].products.findIndex(p => p.product === productId);
      if (existingProductIndex !== -1) {
        carritos[index].products[existingProductIndex].quantity += quantity;
      } else {
        carritos[index].products.push({ product: productId, quantity });
      }
      await fs.writeFile('carrito.json', JSON.stringify(carritos, null, 2));
      res.json(carritos[index]);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;

