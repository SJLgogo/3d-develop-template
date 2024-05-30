import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Demo1Component } from './5.shader本来的用途/1.冯氏光照模型/demo1.component';
import { Demo2Component } from './5.shader本来的用途/2.镜面反射/demo2.component';
import { ImgProComponent } from './7.图片特效/img-pro/img-pro.component';



const routes: Routes = [
    {path:'',redirectTo:'5_demo_2'},
    {path:'5_demo_1' , component:Demo1Component, data:{title:'冯氏光照模型'}},
    {path:'5_demo_2' , component:Demo2Component , data:{title:'IBL镜面模型'}},
    {path:'imgPro' , component:ImgProComponent , data:{title:'图片特效'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FragmentRoutingModule { }
