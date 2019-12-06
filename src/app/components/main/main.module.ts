import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
// import { StoreModule } from '@ngrx/store';
// import { reducer } from '../../store/reducers/usuario.reducer';
import { HomeComponent } from '../home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersListComponent } from '../users/users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from '../users/user/user.component';
import { PointsListComponent } from '../points-of-interest/points-list/points-list.component';
import { PointComponent } from '../points-of-interest/point/point.component';
// import { ReportsComponent } from '../reports/reports.component';
// import { CustomersListComponent } from '../reports/customers-list/customers-list.component';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MainComponent,
    UsersListComponent,
    UserComponent,
    PointsListComponent,
    PointComponent,
    // ReportsComponent,
    // CustomersListComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainRoutingModule,
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTl_nawpJjCbIttRuv5yyViHtSrGtghpM'
    })
    // StoreModule.forFeature('account', reducer)
  ],
  entryComponents: [ UserComponent, PointComponent ]
})
export class MainModule { }
