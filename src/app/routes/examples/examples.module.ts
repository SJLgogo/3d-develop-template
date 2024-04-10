import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplesRoutingModule } from './examples-routing.module';
import { MenuComponent } from './menu/menu.component';
import { ShaderComponent } from './menu/demo/shader/shader.component';


@NgModule({
  declarations: [
    MenuComponent,
    ShaderComponent
  ],
  imports: [
    CommonModule , ExamplesRoutingModule 
  ]
})
export class ExamplesModule { }
