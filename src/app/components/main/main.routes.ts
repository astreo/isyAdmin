import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UsersListComponent } from '../users/users-list/users-list.component';


export const mainRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'usuario', component: UsersListComponent },
  { path: 'dashboard', component: DashboardComponent },
];
