const express = require('express');
const bodyParser = require('body-parser');
const mqttRouter = require('./routes/mqtt');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app); // Importa http
const socketIO = require('socket.io');

// Crear el servidor de Socket.IO
const io = socketIO(http, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
app.use(bodyParser.json());
app.use(cors()); // Habilita el CORS en todas las rutas
// Configuración de la conexión a la base de datos PostgreSQL
const client = new Client({
  host: 'containers-us-west-143.railway.app',
  port: 7040, // Puerto por defecto de PostgreSQL
  database: 'railway',
  user: 'postgres',
  password: 'RB40eSXKi92UBpCSqtPP',
});

// Conexión a la base de datos
client.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Configura la conexión con socket.io
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Escucha el evento 'mqtt_message' desde el cliente Angular
  socket.on('mqtt_message', (data) => {
    console.log('Mensaje MQTT recibido desde el cliente:', data);
    // Aquí puedes realizar acciones con los datos recibidos desde el cliente Angular
  });
});

// Middleware para la ruta '/line'
app.use('/line', mqttRouter(io)); // Pasa la instancia de io al middleware
//app.use(socketIoMiddleware(io));


// Ruta para consultar por fecha (día, mes y año)
app.get('/data', (req, res) => {
  const { day, month, year } = req.query;
  
  // Lógica de construcción de la fecha
  let dateFilter = '';
  let values = [];

  if (day && month && year) {
    // Filtro por día, mes y año
    dateFilter = 'fecha::date = $1';
    values = [`${year}-${month}-${day}`];
  } else if (month && year) {
    // Filtro por mes y año
    dateFilter = 'extract(month from fecha) = $1 AND extract(year from fecha) = $2';
    values = [month, year];
  } else if (year) {
    // Filtro por año
    dateFilter = 'extract(year from fecha) = $1';
    values = [year];
  } else {
    // No se proporcionaron suficientes parámetros de fecha
    return res.status(400).json({ error: 'Parámetros de fecha incorrectos' });
  }

  // Consulta a la base de datos
  const query = `
    SELECT temperatura, humedad, fecha
    FROM sensor
    WHERE ${dateFilter};
  `;

  client.query(query, values)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    });
});
// Ruta para validar el usuario y la contraseña
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;
console.log(email);
console.log(contraseña);
  // Consulta a la base de datos para obtener el usuario
  const query = `
    SELECT  *
    FROM usuarios
    WHERE email = $1 AND contraseña = $2;
  `;

  const values = [email, contraseña];

  // Ejecutar la consulta y manejar los resultados
  client.query(query, values)
    .then((result) => {
      // Verificar si se encontró un usuario con las credenciales proporcionadas
      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.json({ message: 'Inicio de sesión exitoso', user });
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
      }
    })
    .catch((error) => {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    });
});

// Ruta para apagar el LED
app.put('/led', (req, res) => {
  const { state } = req.body;

  if (state === 'on') {
    led.writeSync(1); // Enciende el LED
    res.json({ message: 'LED encendido' });
  } else if (state === 'off') {
    led.writeSync(0); // Apaga el LED
    res.json({ message: 'LED apagado' });
  } else {
    res.status(400).json({ error: 'Estado inválido' });
  }
});

// Inicia el servidor en el puerto 3000
http.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
