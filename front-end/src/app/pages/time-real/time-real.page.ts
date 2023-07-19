import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../shared/menu/menu.component';
import { ApiService } from './../../services/ApiService';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { io,Socket  } from 'socket.io-client';

import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-time-real',
  templateUrl: './time-real.page.html',
  styleUrls: ['./time-real.page.scss'],
})
export class TimeRealPage implements OnInit {
  selectedFilter: string | undefined;
  chart: any;
  chart2: any;
  mensajes: string[] = [];
  temperaturas: number[] = [];
  humedades: number[] = [];
  fechas: string[] = [];
  maxDataPoints = 50;
  isLedOn = false;
  constructor(private apiService: ApiService, private http: HttpClient) {
    Chart.register(...registerables);
  } // Inyecta HttpClient



  ngOnInit() {
    this.apiService.getMessages().subscribe(messages => {
      // Actualizar los mensajes y refrescar la vista
      console.log(messages);
      this.mensajes = messages;
    });

    // Establecer conexión con el servidor WebSocket
    const socket = io('http://localhost:3000'); // Reemplaza la URL con tu dirección de servidor WebSocket

    // Escuchar el evento 'mqtt_message' desde el servidor
    socket.on('mqtt_message', (data: any) => {
      const parsedData = JSON.parse(data);

  // Ahora puedes acceder a las propiedades del objeto
  const TEMPERATURA = parsedData.temperatura;
  const HUMEDAD = parsedData.humedad;
  const FECHA = parsedData.timestamp;

  console.log(TEMPERATURA, HUMEDAD, FECHA);
      // Aquí puedes realizar acciones con los datos recibidos desde el servidor
      // Actualiza los valores de temperaturas, humedad, etc. con los datos recibidos
       // Extraer los campos de temperatura, humedad y fecha del objeto data

  console.log(TEMPERATURA);
  // Agregar los datos a los arrays
  this.temperaturas.push(TEMPERATURA);
  this.humedades.push(HUMEDAD);
  this.fechas.push(FECHA);

  // Verificar si el array ha alcanzado el máximo de elementos
  if (this.temperaturas.length > this.maxDataPoints) {
    // Si ha alcanzado el máximo, eliminar el primer elemento (el más antiguo)
    this.temperaturas.shift();
    this.humedades.shift();
    this.fechas.shift();
  }

  // Aquí puedes realizar otras acciones con los datos recibidos

  // Por ejemplo, puedes llamar a una función para actualizar la gráfica
  this.actualizarGrafica();
    });
  }
  toggleLed() {
    const estado = this.isLedOn ? 'True' : 'False';
     // Establecer conexión con el servidor WebSocket
     const url = 'http://localhost:3000/line/send-message';
     const body = { message: estado };
 
     this.http.post(url, body).subscribe(
       (response) => {
         console.log('Mensaje enviado correctamente:', response);
         // Realiza aquí cualquier acción que necesites después de enviar el mensaje.
       },
       (error) => {
         console.error('Error al enviar el mensaje:', error);
         // Maneja aquí el error si es necesario.
       }
     );
    console.log('Enviando estado del LED:', estado);
   //socket.publish('hogar/cocina/luz/state', estado, { qos: 1, retain: true });
    
   // this.mqttClient.publish('hogar/cocina/luz/state', estado, { qos: 1, retain: true });
  }
  actualizarGrafica() {
    // Aquí actualizas la gráfica con los datos almacenados en los arrays
    // Por ejemplo, si estás usando un gráfico de línea con Chart.js:
  
    if (this.chart) {
      this.chart.destroy();
    } 
    this.chart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels:  this.fechas,
        datasets: [
          {
            label: 'Temperatura',
            data: this.temperaturas,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    if (this.chart2) {
      this.chart2.destroy();
    } 
    this.chart2 = new Chart('temperatureChart2', {
      type: 'line',
      data: {
        labels:  this.fechas,
        datasets: [
          {
            label: 'Temperatura',
            data: this.humedades,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
