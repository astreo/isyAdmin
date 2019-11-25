import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { usuarios as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Router } from '@angular/router';

@Injectable()
export class UsuariosEffects {

  constructor(
    private actions$: Actions, public usuarioService: UsuarioService, public store: Store<AppState>, private router: Router
  ) { }

  @Effect()
  cargarUsuarios$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIOS),
      map((action: actions.CargarUsuarios) => action.idProveedor),
      switchMap((idProveedor) => this.usuarioService.getUsers(idProveedor)
        .pipe(
          map(response => new actions.CargarUsuariosSuccess(response)
          ),
          catchError(error => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              type: 'error',
              confirmButtonText: 'OK'
            });
            return of(new actions.CargarUsuariosFail(error));
          }
          ))
      )
    );

  // --
  @Effect()
  agregarUsuario$ = this.actions$.pipe(
    ofType(actions.AGREGAR_USUARIO),
    map((action: actions.AgregarUsuario) => action),
    switchMap((action) => this.usuarioService.addUser(action.usuario)
      .pipe(
        map(response => {
          Swal.fire({
            title: 'Agregado!',
            text: `El usuario ${action.usuario.username} ha sido agregado con éxito`,
            type: 'success',
            confirmButtonText: 'OK'
          });
          return new actions.AgregarUsuarioSuccess(response);
        }
        ),
        catchError(error => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
          return of(new actions.AgregarUsuarioFail(error));
        }
        ))
    )
  );
  // --

  @Effect()
  actualizarUsuario$ = this.actions$.pipe(
    ofType(actions.ACTUALIZAR_USUARIO),
    map((action: actions.ActualizarUsuario) => action),
    switchMap((payload) => this.usuarioService.updateUser(payload.usuario)
      .pipe(
        map(response => {
          Swal.fire({
            title: 'Actualizado!',
            text: `El usuario ${response.username} ha sido actualizado con éxito`,
            type: 'success',
            confirmButtonText: 'OK'
          });
          return new actions.ActualizarUsuarioSuccess();
        }
        ),
        catchError(error => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
          return of(new actions.ActualizarUsuarioFail(error));
        }
        ))
    )
  );

  // ---
  @Effect()
  actualizarPassword$ = this.actions$.pipe(
    ofType(actions.ACTUALIZAR_PASSWORD),
    map((action: actions.ActualizarPassword) => action),
    switchMap((payload) => this.usuarioService.updatePassword(payload.usuario)
      .pipe(
        map(response => {
          Swal.fire({
            title: 'Procesado!',
            text: `El proceso de cambio de password para ${response.username} se ha iniciado`,
            type: 'success',
            confirmButtonText: 'OK'
          });
          return new actions.ActualizarUsuarioSuccess();
        }
        ),
        catchError(error => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
          return of(new actions.ActualizarUsuarioFail(error));
        }
        ))
    )
  );
  // ---


  @Effect()
  eliminarUsuario$ = this.actions$.pipe(
    ofType(actions.ELIMINAR_USUARIO),
    map((action: actions.EliminarUsuario) => action),
    switchMap((payload) => this.usuarioService.deletetUser(payload.idUsuario)
      .pipe(
        map(() => {
          Swal.fire({
            title: 'Eliminado!',
            text: `El usuario ${payload.idUsuario} ha sido eliminado con éxito`,
            type: 'success',
            confirmButtonText: 'OK'
          });
          return new actions.EliminarUsuarioSuccess(payload.idUsuario);
        }
        ),
        catchError(error => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
          return of(new actions.EliminarUsuarioFail(error));
        }
        ))
    )
  );
}
