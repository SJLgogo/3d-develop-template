import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplesRoutingModule } from './examples-routing.module';
import { MenuComponent } from './menu/menu.component';
import { ShaderComponent } from './menu/demo/shader/shader.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';
import { EnergyShieldComponent } from './menu/demo/能量盾/energy-shield/energy-shield.component';


@NgModule({
  declarations: [
    MenuComponent,
    ShaderComponent,
    SceneBeautComponent,
    EnergyShieldComponent
  ],
  imports: [
    CommonModule , ExamplesRoutingModule 
  ]
})
export class ExamplesModule { }
