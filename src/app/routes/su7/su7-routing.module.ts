import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Su7Component } from './views/su7/su7.component';

const routes: Routes = [
    { path: '', redirectTo: 'index' },
    { path: 'index', component:Su7Component },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Su7RoutingModule { }
