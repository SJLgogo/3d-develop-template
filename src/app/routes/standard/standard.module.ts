import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardRoutingModule } from './standard-routing.module';
import { MainComponent } from './main/main.component';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule, StandardRoutingModule
  ]
})
export class StandardModule { }
