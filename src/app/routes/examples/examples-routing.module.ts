import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ShaderComponent } from './menu/demo/shader/shader.component';
import { SceneBeautComponent } from './menu/demo/scene-beaut/scene-beaut.component';

const routes: Routes = [
    {path:'',redirectTo:'demo1'},
    {path:'demo1', component:ShaderComponent ,data:{title:'基础shader'}},
    {path:'demo2', component:SceneBeautComponent ,data:{title:'场景美化'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamplesRoutingModule { }
