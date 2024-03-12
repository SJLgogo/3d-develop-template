import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'standard', pathMatch: 'full' },
  { path: 'standard', loadChildren: () => import('./routes//standard/standard.module').then(m => m.StandardModule) },
  { path: 'sketch', loadChildren: () => import('./routes//sketch/sketch.module').then(m => m.SketchModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
