import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.scss'],
})
export class TemperatureChartComponent implements OnInit {
  chart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.chart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Temperatura',
            data: [20, 25, 22, 24, 28, 26, 30],
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
    this.chart = new Chart('temperatureChart2', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Temperatura',
            data: [20, 25, 22, 24, 28, 26, 30],
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
