import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HuiztechRoutingModule } from './huiztech-routing.module';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule , HuiztechRoutingModule
  ]
})
export class HuiztechProModule { }
