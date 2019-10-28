import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {usuario as actions} from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class UsuarioEffects {

  constructor(
    private actions$: Actions, public usuariosService: AuthService, private router: Router
  ) { }

  @Effect()
  cargarUsuario$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIO),
      pipe(
        switchMap((action: actions.CargarUsuario) => {
          console.log('effect');
          console.log(action.usuario);
          return this.usuariosService.login(action.usuario)
            .pipe(
              map(user => {
                this.router.navigate(['/home']);
                return new actions.CargarUsuarioSuccess(user);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error en el Login!',
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
