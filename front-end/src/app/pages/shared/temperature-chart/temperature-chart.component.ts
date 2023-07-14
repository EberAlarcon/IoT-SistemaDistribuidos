import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.scss'],
})
export class TemperatureChartComponent implements OnInit {
  chart: any;
  temperaturas: number[] = [];
  date= [];
  constructor() {
    Chart.register(...registerables);
  }
  async getData() {
    const resp = await fetch('http://localhost:3000/data?days=11&month=07&year=2023');
  
    const data = await resp.json();
    this.temperaturas = data.map((item: any) => Number(item.humedad));
    this.date = data.map((item: any) => item.fecha.substring(0, 10));
  
    console.log( this.date);
    
  
  
  }
  ngOnInit() {


  }
}
