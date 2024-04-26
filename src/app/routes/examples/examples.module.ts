import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplesRoutingModule } from './examples-routing.module';
import { MenuComponent } from './menu/menu.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';
import { EnergyShieldComponent } from './menu/demo/Shader/能量盾/energy-shield/energy-shield.component';
import { EnergyHaloComponent } from './menu/demo/Shader/能量光环/energy-halo/energy-halo.component';
import { ParticlesComponent } from './menu/demo/Shader/网格粒子/particles/particles.component';


@NgModule({
  declarations: [
    MenuComponent,
    SceneBeautComponent,
    EnergyShieldComponent,
    EnergyHaloComponent,
    ParticlesComponent
  ],
  imports: [
    CommonModule , ExamplesRoutingModule 
  ]
})
export class ExamplesModule { }
