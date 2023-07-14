import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { TemperatureChartComponent } from '../shared/temperature-chart/temperature-chart.component';
import { HeaderComponent } from '../shared/header/header.component';
import {MenuComponent} from'../shared/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage, TemperatureChartComponent, HeaderComponent,MenuComponent]
})
export class DashboardPageModule {}
