import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UsersListComponent } from '../users/users-list/users-list.component';
// import { ReportsComponent } from '../reports/reports.component';
// import { CustomersListComponent } from '../reports/customers-list/customers-list.component';
import { PointsListComponent } from '../points-of-interest/points-list/points-list.component';
import { VerificationCodesListComponent } from '../verification-codes/verification-codes-list/verification-codes-list.component';
import { DangerZonesListComponent } from '../danger-zones/danger-zones-list/danger-zones-list.component';
import { PanelsListComponent } from '../panels/panels-list/panels-list.component';
import { GpsListComponent } from '../gps/gps-list/gps-list.component';
import { CustomersListComponent } from '../customers/customers-list/customers-list.component';
import { ServicesListComponent } from '../emergency-and-services/services-list/services-list.component';


export const mainRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'usuario', component: UsersListComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'reporte',
    loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule),
    // canLoad: [ AuthGuardService ]
  },
  { path: 'puntointeres', component: PointsListComponent },
  { path: 'geocerca', component: DangerZonesListComponent },
  { path: 'codigoverificacion', component: VerificationCodesListComponent },
  { path: 'panel', component: PanelsListComponent },
  { path: 'gps', component: GpsListComponent },
  { path: 'persona', component: CustomersListComponent },
  { path: 'solicitudservicio', component: ServicesListComponent },
];
