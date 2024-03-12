import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SketchRoutingModule } from './sketch-routing.module';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule , SketchRoutingModule
  ]
})
export class SketchModule { }
