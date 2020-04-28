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
import { VerificationCodesListComponent } from '../verification-codes/verification-codes-list/verification-codes-list.component';
import { DangerZonesListComponent } from '../danger-zones/danger-zones-list/danger-zones-list.component';
import { DangerZoneComponent } from '../danger-zones/danger-zone/danger-zone.component';
import { CheckboxValueDirective } from 'src/app/directives/checkbox-value.directive';
import { PanelsListComponent } from '../panels/panels-list/panels-list.component';
import { PanelComponent } from '../panels/panel/panel.component';
import { GpsListComponent } from '../gps/gps-list/gps-list.component';
import { GpsDetailComponent } from '../gps/gps-detail/gps-detail.component';
import { CustomersListComponent } from '../customers/customers-list/customers-list.component';
import { CustomerComponent } from '../customers/customer/customer.component';
import { CustomerPanelComponent } from '../customers/customer-panel/customer-panel.component';
import { CustomerGpsComponent } from '../customers/customer-gps/customer-gps.component';
import { CustomerAddComponent } from '../customers/customer-add/customer-add.component';
import { CustomerPanelEventsComponent } from '../customers/customer-panel-events/customer-panel-events.component';
import { ServicesListComponent } from '../emergency-and-services/services-list/services-list.component';
import { ServicesDetailComponent } from '../emergency-and-services/services-detail/services-detail.component';
import { NewsDetailComponent } from '../news/news-detail/news-detail.component';
import { NewsListComponent } from '../news/news-list/news-list.component';
import { BannersListComponent } from '../banners/banners-list/banners-list.component';
import { BannerComponent } from '../banners/banner/banner.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MainComponent,
    UsersListComponent,
    UserComponent,
    PointsListComponent,
    PointComponent,
    VerificationCodesListComponent,
    DangerZonesListComponent,
    DangerZoneComponent,
    CheckboxValueDirective,
    PanelsListComponent,
    PanelComponent,
    GpsListComponent,
    GpsDetailComponent,
    CustomersListComponent,
    CustomerComponent,
    CustomerPanelComponent,
    CustomerGpsComponent,
    CustomerAddComponent,
    CustomerPanelEventsComponent,
    ServicesListComponent,
    ServicesDetailComponent,
    NewsDetailComponent,
    NewsListComponent,
    BannersListComponent,
    BannerComponent
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
      apiKey: 'AIzaSyBTl_nawpJjCbIttRuv5yyViHtSrGtghpM',
      libraries: ['drawing']
    })
    // StoreModule.forFeature('account', reducer)
  ],
  entryComponents: [
    UserComponent,
    PointComponent,
    DangerZoneComponent,
    PanelComponent,
    GpsDetailComponent,
    CustomerComponent,
    CustomerPanelComponent,
    CustomerGpsComponent,
    CustomerAddComponent,
    CustomerPanelEventsComponent,
    ServicesDetailComponent,
    NewsDetailComponent,
    BannerComponent
  ]
})
export class MainModule { }
