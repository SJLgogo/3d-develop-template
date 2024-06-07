import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplesRoutingModule } from './examples-routing.module';
import { MenuComponent } from './menu/menu.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';
import { EnergyShieldComponent } from './menu/demo/Shader/能量盾/energy-shield/energy-shield.component';
import { ParticlesComponent } from './menu/demo/Shader/网格粒子/particles/particles.component';
import { SceneSwitchingComponent } from './menu/demo/scene-switching/scene-switching.component';
import { OutlineComponent } from './menu/demo/PostProcessing/outline/outline.component';
import { UnrealBloomSelectiveComponent } from './menu/demo/PostProcessing/unreal-bloom-selective/unreal-bloom-selective.component';
import { UnrealBloomComponent } from './menu/demo/PostProcessing/unreal-bloom/unreal-bloom.component';
import { FireBallComponent } from './menu/demo/fire-ball/fire-ball/fire-ball.component';
import { ShaderFireComponent } from './menu/demo/shader-fire/shader-fire.component';
import { BurnComponent } from './menu/demo/burn/burn.component';
import { HyperSpaceComponent } from './menu/demo/hyper-space/hyper-space.component';


@NgModule({
  declarations: [
    MenuComponent,
    SceneBeautComponent,
    EnergyShieldComponent,
    ParticlesComponent,
    SceneSwitchingComponent,
    OutlineComponent,
    UnrealBloomSelectiveComponent,
    UnrealBloomComponent,
    FireBallComponent,
    ShaderFireComponent,
    BurnComponent,
    HyperSpaceComponent,
  ],
  imports: [
    CommonModule , ExamplesRoutingModule 
  ]
})
export class ExamplesModule { }
