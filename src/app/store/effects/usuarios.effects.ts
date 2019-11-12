import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { usuarios as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

@Injectable()
export class UsuariosEffects {

  constructor(
    private actions$: Actions, public usuarioService: UsuarioService, public store: Store<AppState>
  ) { }

  @Effect()
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
    );

  // --
  @Effect()
  agregarUsuario$ = this.actions$
    .pipe(
      ofType(actions.AGREGAR_USUARIO),
      pipe(
        switchMap((action: actions.AgregarUsuario) => {
          console.log('effect1');
          return this.usuarioService.addUser(action.usuario)
            .pipe(
              map(() => {
                console.log('effect2');
                return new actions.AgregarUsuarioSuccess();
                // return new actions.ActualizarUsuarioSuccess(user);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.AgregarUsuarioFail(error));
              })
            );
        })
      )
    );
  // --

  @Effect()
  actualizarUsuario$ = this.actions$
    .pipe(
      ofType(actions.ACTUALIZAR_USUARIO),
      pipe(
        switchMap((action: actions.ActualizarUsuario) => {
          console.log('effect1');
          return this.usuarioService.updateUser(action.usuario)
            .pipe(
              map(() => {
                console.log('effect2');
                return new actions.ActualizarUsuarioSuccess();
                // return new actions.ActualizarUsuarioSuccess(user);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.ActualizarUsuarioFail(error));
              })
            );
        })
      )
    );


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
                console.log('effect2');
                return new actions.EliminarUsuarioSuccess();
                // return new actions.ActualizarUsuarioSuccess(user);
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
