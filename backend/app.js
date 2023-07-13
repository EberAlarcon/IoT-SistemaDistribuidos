const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());

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
// Ruta para consultar por fecha (día, mes y año)
app.get('/data', (req, res) => {
   /// console.log(req.query);
    const { day, month, year } = req.query;
    console.log(day);
    // Consulta a la base de datos por fecha
    const query = `
    SELECT *
    FROM prueba
    WHERE fecha::date = $1;
  `;
  
  const values = [`${day}`]; // Format the date as 'YYYY-MM-DD'
  
  client.query(query, values)
      .then((result) => {
        res.json(result.rows);
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

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error en el servidor' });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
