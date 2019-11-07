import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { usuarios as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Store, select } from '@ngrx/store';
import { AppState, getUsuarios } from '../app.reducer';

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
