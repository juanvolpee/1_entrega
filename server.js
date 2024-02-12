const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./productsRouter');
const cartsRouter = require('./cartsRouter');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
