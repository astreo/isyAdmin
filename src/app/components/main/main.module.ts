import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
// import { StoreModule } from '@ngrx/store';
import { reducer } from '../../store/reducers/usuario.reducer';
import { HomeComponent } from '../home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { UsersListComponent } from '../users/users-list/users-list.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MainComponent,
    UsersListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MainRoutingModule,
    TranslateModule.forChild(),
    // StoreModule.forFeature('account', reducer)
  ]
})
export class MainModule { }
