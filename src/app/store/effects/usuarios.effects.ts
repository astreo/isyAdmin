import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {usuarios as actions} from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Injectable()
export class UsuariosEffects {

  constructor(
    private actions$: Actions, public usuarioService: UsuarioService
  ) { }

  @Effect()
  cargarUsuarios$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIOS),
      pipe(
        switchMap((action: actions.CargarUsuarios) => {
          console.log('effects');
          return this.usuarioService.getUsers(action.idProveedor)
            .pipe(
              map(users => {
                // debugger;
                console.log('effect');
                console.log(users);
                return new actions.CargarUsuariosSuccess(users);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.CargarUsuariosFail(error));
              })
            );
        })
      )
    );
}
