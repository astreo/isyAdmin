import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { perfil as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, concatMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PerfilService } from 'src/app/services/perfil.service';
import { Store, select } from '@ngrx/store';
import { AppState, getPerfiles } from '../app.reducer';
import { perfil as reducer } from '../reducers';
import { Perfil } from '../../models/perfil.model';

@Injectable()
export class PerfilEffects {

  constructor(
    private actions$: Actions, public perfilService: PerfilService, public store: Store<AppState>
  ) { }

  /*
  @Effect()
  cargarPerfiles$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_PERFILES),
      pipe(
        switchMap((action: actions.CargarPerfiles) => {
          return this.perfilService.getPerfiles()
            .pipe(
              map(perfiles => {
                return new actions.CargarPerfilesSuccess(perfiles);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.CargarPerfilesFail(error));
              })
            );
        })
      )
    );
    */


  @Effect()
  cargarPerfiles$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_PERFILES),
      withLatestFrom(this.store.pipe(select(getPerfiles))),
      switchMap(([action, itemsList]: [actions.CargarPerfiles, any[]]) => {
        return this.perfilService.getPerfiles()
          .pipe(
            map(perfiles => {
              return new actions.CargarPerfilesSuccess(perfiles);
            }),
            catchError((error) => {
              Swal.fire({
                title: 'Error!',
                text: error.message,
                type: 'error',
                confirmButtonText: 'OK'
              });
              return of(new actions.CargarPerfilesFail(error));
            })
          );
      })
    );


}
