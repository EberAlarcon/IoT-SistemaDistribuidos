import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeRealPage } from './time-real.page';

const routes: Routes = [
  {
    path: '',
    component: TimeRealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeRealPageRoutingModule {}
