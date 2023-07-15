import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeRealPageRoutingModule } from './time-real-routing.module';

import { TimeRealPage } from './time-real.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeRealPageRoutingModule,
    
  ],
  declarations: [TimeRealPage]
})
export class TimeRealPageModule {}
