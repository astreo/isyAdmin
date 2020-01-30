import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { usuario as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class UsuarioEffects {

  constructor(
    private actions$: Actions, public accountService: AccountService, private router: Router
  ) { }

  @Effect()
  cargarUsuario$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIO),
      pipe(
        switchMap((action: actions.CargarUsuario) => {
          return this.accountService.login(action.usuario)
            .pipe(
              map(user => {
                // debugger;
                if (user.resetPassword) {
                  this.router.navigate(['/newPwd', { username: user.username }], { skipLocationChange: true });
                } else {
                  this.router.navigate(['/home']);
                }
                return new actions.CargarUsuarioSuccess(user);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.CargarUsuarioFail(error));
              })
            );
        })
      )
    );
}
