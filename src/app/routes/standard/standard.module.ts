import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardRoutingModule } from './standard-routing.module';
import { MainComponent } from './main/main.component';
import { PathFindComponent } from './views/path-find/path-find.component';



@NgModule({
  declarations: [
    MainComponent,
    PathFindComponent
  ],
  imports: [
    CommonModule, StandardRoutingModule
  ]
})
export class StandardModule { }
