import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FragmentRoutingModule } from './fragment-routing.module';
import { Demo1Component } from './5.shader本来的用途/1.冯氏光照模型/demo1.component';
import { Demo2Component } from './5.shader本来的用途/2.镜面反射/demo2.component';
import { ImgProComponent } from './7.图片特效/img-pro/img-pro.component';



@NgModule({
  declarations: [
    Demo2Component,
    Demo1Component,
    ImgProComponent
  ],
  imports: [
    CommonModule , FragmentRoutingModule
  ]
})
export class FragmentModule { }
