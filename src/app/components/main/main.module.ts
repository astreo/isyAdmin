import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
// import { StoreModule } from '@ngrx/store';
// import { reducer } from './ingreso-egreso.reducer';
import { HomeComponent } from '../home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MainRoutingModule,
    TranslateModule.forChild()
    // StoreModule.forFeature('ingresoEgreso', reducer)
  ]
})
export class MainModule { }
