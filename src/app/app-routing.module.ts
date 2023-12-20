import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'standard', pathMatch: 'full' },
  { path: 'standard', loadChildren: () => import('./routes//standard/standard.module').then(m => m.StandardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
