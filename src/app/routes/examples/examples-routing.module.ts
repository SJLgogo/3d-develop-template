import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';
import { EnergyShieldComponent } from './menu/demo/Shader/能量盾/energy-shield/energy-shield.component';
import { EnergyHaloComponent } from './menu/demo/Shader/能量光环/energy-halo/energy-halo.component';
import { ParticlesComponent } from './menu/demo/Shader/网格粒子/particles/particles.component';
import { SceneSwitchingComponent } from './menu/demo/scene-switching/scene-switching.component';
import { OutlineComponent } from './menu/demo/PostProcessing/outline/outline.component';
import { UnrealBloomSelectiveComponent } from './menu/demo/PostProcessing/unreal-bloom-selective/unreal-bloom-selective.component';
import { UnrealBloomComponent } from './menu/demo/PostProcessing/unreal-bloom/unreal-bloom.component';

const routes: Routes = [
    {path:'',redirectTo:'demo2'},
    {path:'demo2', component:SceneBeautComponent ,data:{title:'场景美化'}},
    {path:'demo3', component:EnergyShieldComponent ,data:{title:'能量盾'}},
    {path:'particles', component:ParticlesComponent ,data:{title:'网格粒子'}},
    {path:'scene-switching', component:SceneSwitchingComponent ,data:{title:'反射'}},
    {path:'process_outline', component:OutlineComponent ,data:{title:'后期处理_outline'}},
    {path:'process_bloom', component:UnrealBloomSelectiveComponent ,data:{title:'后期处理_bloom_1'}},   
    {path:'bloom', component:UnrealBloomComponent ,data:{title:'后期处理_bloom_2'}},   
    
    
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamplesRoutingModule { }
