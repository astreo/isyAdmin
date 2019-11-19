import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { NewPwdComponent } from './components/auth/new-pwd/new-pwd.component';

const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'newPwd', component: NewPwdComponent },
    {
        path: '',
        loadChildren: './components/main/main.module#MainModule',
        // canLoad: [ AuthGuardService ]
    },
    { path: '**', redirectTo: '' },

];

@NgModule({
    imports: [
        RouterModule.forRoot( routes )
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {}
