const express = require('express');
const mqtt = require('mqtt');
const { Pool } = require('pg');
const router = express.Router();

const mBroker = 'rat.rmq2.cloudamqp.com';
const mPort = 1883;
const mTopic = 'uleam/fcvt/#';
const mUsername = 'scecckcu:scecckcu';
const mPassword = 'UBQj1gLTSh-3NucCEbg-i5WhHLvtOiKA';
let lastMessage = '';
let ioInstance; // Variable para almacenar la instancia de io

const client = mqtt.connect(`mqtt://${mBroker}:${mPort}`, {
  username: mUsername,
  password: mPassword
});
const pool = new Pool({
  user: 'postgres',
  host: 'containers-us-west-143.railway.app',
  database: 'railway',
  password: 'RB40eSXKi92UBpCSqtPP',
  port: 7040,
});
client.on('connect', () => {
  console.log('Connected to MQTT Broker!');
  client.subscribe(mTopic);
});

client.on('message', (topic, message) => {
 // console.log(`Received '${message.toString()}' from '${topic}' topic`);
  lastMessage = message.toString();
  const data = JSON.parse(lastMessage);
  // Emitir el evento 'mqtt_message' a través de la instancia de io
  if (ioInstance) {
    ioInstance.emit('mqtt_message', lastMessage);
  }
  const { temperatura, humedad, sensor, latitud, longitud, timestamp } = data;

  const fecha = new Date(timestamp * 1000);

  // Obtener los componentes de la fecha
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  
  // Formatear la fecha como una cadena en el formato deseado (por ejemplo, "YYYY-MM-DD HH:mm:ss")
  const fechaFormateada = `${year}-${month}-${day}`;

  const query = `
    INSERT INTO sensor (temperatura, humedad, sensor, latitud, longitud, fecha)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [temperatura, humedad, sensor, latitud, longitud, fechaFormateada];

  pool.query(query, values)
    .then(() => {
      console.log('Datos guardados en PostgreSQL correctamente.');
    })
    .catch((error) => {
      console.error('Error al guardar los datos en PostgreSQL:', error);
    });

  // Realiza las acciones necesarias con los datos recibidos
});

router.get('/last-message', (req, res) => {
  res.send(lastMessage);
});

// Ruta para enviar el mensaje MQTT al tópico "hogar/cocina/luz/state"
router.post('/send-message', (req, res) => {
  const { message } = req.body;
  client.publish('hogar/cocina/luz/state', message);
  console.log(message);
  res.send('Mensaje enviado al tópico "hogar/cocina/luz/state"');
});

// Middleware para recibir la instancia de io
module.exports = (io) => {
  ioInstance = io;
  return router;
};
