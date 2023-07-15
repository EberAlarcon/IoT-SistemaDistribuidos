import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../shared/menu/menu.component';
@Component({
  selector: 'app-time-real',
  templateUrl: './time-real.page.html',
  styleUrls: ['./time-real.page.scss'],
})
export class TimeRealPage implements OnInit {
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
  constructor() { }
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
  ngOnInit() {
  }

}
