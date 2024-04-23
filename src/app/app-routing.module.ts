import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './routes/examples/menu/menu.component';

const routes: Routes = [
  { path: '', redirectTo: 'examples', pathMatch: 'full' },
  { path: 'standard', loadChildren: () => import('./routes//standard/standard.module').then(m => m.StandardModule) },
  { path: 'su7', loadChildren: () => import('./routes/su7/su7.module').then(m => m.Su7Module) },
  { path: 'huiztech', loadChildren: () => import('./routes/huiztech-pro/huiztech-pro.module').then(m => m.HuiztechProModule) },
  { path: 'examples', component:MenuComponent , children:[
    {path:'' , loadChildren: () => import('./routes/examples/examples.module').then(m => m.ExamplesModule)}
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
