import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Demo1Component } from './5.shader本来的用途/1.冯氏光照模型/demo1.component';


const routes: Routes = [
    {path:'5_demo_1' , component:Demo1Component}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FragmentRoutingModule { }
