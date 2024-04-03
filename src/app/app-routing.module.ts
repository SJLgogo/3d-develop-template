import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'standard', pathMatch: 'full' },
  { path: 'standard', loadChildren: () => import('./routes//standard/standard.module').then(m => m.StandardModule) },
  { path: 'su7', loadChildren: () => import('./routes/su7/su7.module').then(m => m.Su7Module) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
