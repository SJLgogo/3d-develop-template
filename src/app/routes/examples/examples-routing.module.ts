import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ShaderComponent } from './menu/demo/shader/shader.component';

const routes: Routes = [
    {path:'',redirectTo:'shader'},
    {path:'shader', component:ShaderComponent ,data:{title:'基础shader'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamplesRoutingModule { }
