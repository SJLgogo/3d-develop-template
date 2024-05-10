import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FragmentRoutingModule } from './fragment-routing.module';
import { Demo2Component } from './5.shader本来的用途/2.镜面反射/demo2.component';



@NgModule({
  declarations: [
  
    Demo2Component
  ],
  imports: [
    CommonModule , FragmentRoutingModule
  ]
})
export class FragmentModule { }
