import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PathFindComponent } from './views/path-find/path-find.component';

const routes: Routes = [
    { path: '', redirectTo: 'home' },
    { path: 'home', component: MainComponent },
    { path: 'pathFinding', component: PathFindComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StandardRoutingModule { }
