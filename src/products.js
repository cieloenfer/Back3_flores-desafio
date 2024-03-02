const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('productos.json', 'utf-8');
    const productos = JSON.parse(data);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const data = await fs.readFile('products.json', 'utf-8');
    const producto = JSON.parse(data);
    const productos = productos.find(p => p.id === productId);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  const newProduct = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status !== undefined ? req.body.status : true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || [],
  };

  try {
    const data = await fs.readFile('products.json', 'utf-8');
    const productos = JSON.parse(data);
    productos.push(newProduct);
    await fs.writeFile('products.json', JSON.stringify(productos, null, 2));
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const data = await fs.readFile('products.json', 'utf-8');
    const productos = JSON.parse(data);
    const index = productos.findIndex(p => p.id === productId);
    if (index !== -1) {
      productos[index] = { ...productos[index], ...req.body, id: productId };
      await fs.writeFile('products.json', JSON.stringify(productos, null, 2));
      res.json(productos[index]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const data = await fs.readFile('products.json', 'utf-8');
    let productos = JSON.parse(data);
    productos = productos.filter(p => p.id !== productId);
    await fs.writeFile('products.json', JSON.stringify(productos, null, 2));
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;

