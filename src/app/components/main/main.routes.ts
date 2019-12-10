import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UsersListComponent } from '../users/users-list/users-list.component';
// import { ReportsComponent } from '../reports/reports.component';
// import { CustomersListComponent } from '../reports/customers-list/customers-list.component';
import { PointsListComponent } from '../points-of-interest/points-list/points-list.component';
import { VerificationCodesListComponent } from '../verification-codes/verification-codes-list/verification-codes-list.component';


export const mainRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'usuario', component: UsersListComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'reporte',
    loadChildren: '../reports/reports.module#ReportsModule',
    // canLoad: [ AuthGuardService ]
  },
  { path: 'puntointeres', component: PointsListComponent },
  { path: 'codigoverificacion', component: VerificationCodesListComponent },
];
