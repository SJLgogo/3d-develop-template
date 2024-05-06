import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';
import { EnergyShieldComponent } from './menu/demo/Shader/能量盾/energy-shield/energy-shield.component';
import { EnergyHaloComponent } from './menu/demo/Shader/能量光环/energy-halo/energy-halo.component';
import { ParticlesComponent } from './menu/demo/Shader/网格粒子/particles/particles.component';
import { SceneSwitchingComponent } from './menu/demo/scene-switching/scene-switching.component';

const routes: Routes = [
    {path:'',redirectTo:'demo2'},
    {path:'demo2', component:SceneBeautComponent ,data:{title:'场景美化'}},
    {path:'demo3', component:EnergyShieldComponent ,data:{title:'能量盾'}},
    {path:'demo4', component:EnergyHaloComponent ,data:{title:'能量光环'}},
    {path:'particles', component:ParticlesComponent ,data:{title:'网格粒子'}},
    {path:'scene-switching', component:SceneSwitchingComponent ,data:{title:'场景切换'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamplesRoutingModule { }
