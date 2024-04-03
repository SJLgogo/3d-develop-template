import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Su7RoutingModule } from './su7-routing.module';
import { Su7Component } from './views/su7/su7.component';



@NgModule({
  declarations: [
    Su7Component
  ],
  imports: [
    CommonModule,
    Su7RoutingModule
  ]
})
export class Su7Module { }
