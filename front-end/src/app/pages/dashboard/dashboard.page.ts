import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  selectedFilter: string | undefined;
  chart: any;
  chart2: any;
temperaturas: number[] = [];
humedad: number[] = [];
date= [];
 dates = new Date();
 day = this.dates.getDate();
  month = this.dates.getMonth() + 1;
  year = this.dates.getFullYear();
filtroFecha: string | undefined='dia';
 urlParams = `?day=${this.day}&month=${this.month}&year=${this.year}`;
aplicarFiltro() {
 

 if (this.filtroFecha === 'dia') {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.urlParams = `?day=${day}&month=${month}&year=${year}`;
  } else if (this.filtroFecha === 'mes') {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.urlParams = `?month=${month}&year=${year}`;
  } else if (this.filtroFecha === 'año') {
    const date = new Date();
    const year = date.getFullYear();
    this.urlParams = `?year=${year}`;
  }
  this.ngOnInit()

}
async getData(urlParams:any) {
  console.log(urlParams);
  
  const resp = await fetch(`http://localhost:3000/data${urlParams}`);

  const data = await resp.json();
  this.temperaturas = data.map((item: any) => Number(item.temperatura));
  this.humedad = data.map((item: any) => Number(item.humedad));
  this.date = data.map((item: any) => item.fecha.substring(0, 10));

  console.log( this.date);
  


}   constructor() {
  Chart.register(...registerables);
}

ngOnInit() {

  this.getData(this.urlParams).then(() => {
    //console.log(this.temperaturas);
    if (this.chart) {
      this.chart.destroy();
    } 
    this.chart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels:  this.date,
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
        labels:  this.date,
        datasets: [
          {
            label: 'Temperatura',
            data: this.humedad,
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
    // Realiza cualquier operación adicional con this.temperaturas
  });
  //console.log(this.temperaturas);


}

}
