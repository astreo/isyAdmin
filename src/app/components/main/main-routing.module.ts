import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { mainRoutes } from './main.routes';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: mainRoutes,
    /*canActivate: [AuthGuardService]*/
},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
