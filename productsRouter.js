const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid');

const productsFilePath = './data/productos.json';


// Obtener todos los productos con la limitación
router.get('/', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al obtener los productos');
      }
      const products = JSON.parse(data);
      
      // Verificar si se proporcionó un límite
      const limit = req.query.limit;
      if (limit) {
        const limitNumber = parseInt(limit, 10);
        if (!isNaN(limitNumber) && limitNumber > 0) {
          // Aplicar la limitación
          const limitedProducts = products.slice(0, limitNumber);
          res.json(limitedProducts);
        } else {
          return res.status(400).json({ error: 'El parámetro limit debe ser un número positivo.' });
        }
      } else {
        res.json(products);
      }
    });
  });
  

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener el producto');
    }
    const products = JSON.parse(data);
    const product = products.find(product => product.id === productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
  });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const newProduct = req.body;
  newProduct.id = uuid.v4(); // Generar ID
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al agregar el producto');
    }
    const products = JSON.parse(data);
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al agregar el producto');
      }
      res.status(201).json(newProduct);
    });
  });
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al actualizar el producto');
    }
    let products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }
    // No actualizar el ID
    updatedProduct.id = productId;
    products[productIndex] = updatedProduct;
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al actualizar el producto');
      }
      res.json(updatedProduct);
    });
  });
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al eliminar el producto');
    }
    let products = JSON.parse(data);
    const filteredProducts = products.filter(product => product.id !== productId);
    if (products.length === filteredProducts.length) {
      return res.status(404).send('Producto no encontrado');
    }
    fs.writeFile(productsFilePath, JSON.stringify(filteredProducts, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al eliminar el producto');
      }
      res.status(204).send();
    });
  });
});

module.exports = router;
