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
  actualizarUsuario = this.actions$.pipe(
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
  actualizarPassword$ = this.actions$
    .pipe(
      ofType(actions.ACTUALIZAR_PASSWORD),
      pipe(
        switchMap((action: actions.ActualizarPassword) => {
          console.log('effect1');
          return this.usuarioService.updatePassword(action.usuario)
            .pipe(
              map(() => {
                Swal.fire({
                  title: 'Procesado!',
                  text: `El proceso de cambio de password para ${action.usuario.username} se ha iniciado`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                return new actions.ActualizarPasswordSuccess();
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.ActualizarPasswordFail(error));
              })
            );
        })
      )
    );
  // ---


  @Effect()
  eliminarUsuario$ = this.actions$
    .pipe(
      ofType(actions.ELIMINAR_USUARIO),
      pipe(
        switchMap((action: actions.EliminarUsuario) => {
          console.log('effect1');
          return this.usuarioService.deletetUser(action.idUsuario)
            .pipe(
              map(() => {
                Swal.fire({
                  title: 'Eliminado!',
                  text: `El usuario ${action.idUsuario} ha sido eliminado con éxito`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                return new actions.EliminarUsuarioSuccess(action.idUsuario);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.EliminarUsuarioFail(error));
              })
            );
        })
      )
    );


  /*@Effect()
  cargarUsuarios$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIOS),
      pipe(
        switchMap((action: actions.CargarUsuarios) => {
          return this.usuarioService.getUsers(action.idProveedor)
            .pipe(
              map(users => {
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
    );*/

  /* @Effect()
  cargarUsuarios$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_USUARIOS),
      withLatestFrom(this.store.pipe(select(getUsuarios))),
      switchMap(([action, itemsList]: [actions.CargarUsuarios, any[]]) => {
        return this.usuarioService.getUsers(action.idProveedor)
          .pipe(
            map(usuarios => {
              return new actions.CargarUsuariosSuccess(usuarios);
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
    ); */
  /*
    @Effect()
    cargarUsuarios$ = this.actions$
      .pipe(
        ofType(actions.CARGAR_USUARIOS),
        withLatestFrom(this.store.pipe(select(state => state.users.usuarios))),
        switchMap(([action, itemsList]: [actions.CargarUsuarios, any[]]) => {
          return this.usuarioService.getUsers(action.idProveedor)
            .pipe(
              map(usuarios => {
                return new actions.CargarUsuariosSuccess(usuarios);
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
      );
      */
}
