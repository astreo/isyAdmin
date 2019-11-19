import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { NewPwdComponent } from './new-pwd/new-pwd.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LoginComponent,
    NewPwdComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})

export class AuthModule {}
