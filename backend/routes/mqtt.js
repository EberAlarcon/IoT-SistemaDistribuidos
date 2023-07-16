const express = require('express');
const mqtt = require('mqtt');
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

client.on('connect', () => {
  console.log('Connected to MQTT Broker!');
  client.subscribe(mTopic);
});

client.on('message', (topic, message) => {
  console.log(`Received '${message.toString()}' from '${topic}' topic`);
  lastMessage = message.toString();

  // Emitir el evento 'mqtt_message' a través de la instancia de io
  if (ioInstance) {
    ioInstance.emit('mqtt_message', lastMessage);
  }

  // Realiza las acciones necesarias con los datos recibidos
});

router.get('/last-message', (req, res) => {
  res.send(lastMessage);
});

// Middleware para recibir la instancia de io
module.exports = (io) => {
  ioInstance = io;
  return router;
};
