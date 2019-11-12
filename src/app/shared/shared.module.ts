import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmationDialogComponent
  ],
  providers: [ ConfirmationDialogService ],
  entryComponents: [ ConfirmationDialogComponent ]
})
export class SharedModule { }
