import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsComponent } from './reports.component';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsCustomersListComponent } from './products-customers-list/products-customers-list.component';
import { CustomerStatsComponent } from './customer-stats/customer-stats.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'clientes', component: CustomersListComponent },
  { path: 'productosclientes', component: ProductsCustomersListComponent },
  { path: 'estadisticaclientes', component: CustomerStatsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  declarations: [
    ReportsComponent,
    CustomersListComponent,
    ProductsCustomersListComponent,
    CustomerStatsComponent
  ]
})
export class ReportsModule { }
