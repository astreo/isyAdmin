import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { CustomersDialogComponent } from './customers-dialog/customers-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PanelsDialogComponent } from './panels-dialog/panels-dialog.component';



@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmationDialogComponent,
    CustomersDialogComponent,
    PanelsDialogComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmationDialogComponent
  ],
  providers: [ ConfirmationDialogService, CustomersDialogComponent, PanelsDialogComponent ],
  entryComponents: [ ConfirmationDialogComponent, CustomersDialogComponent, PanelsDialogComponent ]
})
export class SharedModule { }
