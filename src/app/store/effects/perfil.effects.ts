import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {perfil as actions} from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PerfilService } from 'src/app/services/perfil.service';

@Injectable()
export class PerfilEffects {

  constructor(
    private actions$: Actions, public perfilService: PerfilService
  ) { }

  @Effect()
  cargarPerfiles$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_PERFILES),
      pipe(
        switchMap((action: actions.CargarPerfiles) => {
          console.log('effects');
          return this.perfilService.getPerfiles()
            .pipe(
              map(perfiles => {
                // debugger;
                console.log('effect');
                console.log(perfiles);
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
}
