const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configurar middleware para manejar archivos estáticos
app.use(express.static('public'));

// Configurar las rutas y los manejadores de Socket.io
const productsRouter = require('./product');
const cartRouter = require('./carrito');
const viewsRouter = require('./routes/views')(io);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Manejador de conexión con Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('addProduct', async (data) => {
    try {
      // Agregar lógica para agregar un nuevo producto al archivo 'productos.json'
      // y obtener la lista actualizada de productos
      const products = await addProduct(data);

      // Emitir el evento a todos los clientes para actualizar la lista en tiempo real
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error);
      // Manejar errores
    }
  });


  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Función para agregar un nuevo producto al archivo 'productos.json'
async function addProduct(newProduct) {
  try {
    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);

    // Añadir el nuevo producto a la lista de productos
    products.push({
      id: (products.length + 1).toString(),
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      // Agrega otros campos según tu estructura de producto
    });

    // Guardar la lista actualizada en el archivo 'productos.json'
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

    return products;
  } catch (error) {
    throw error;
  }
}
// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
