import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { clientes as actions } from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';

@Injectable()
export class ClientesEffects {

  constructor(
    private actions$: Actions, public clientesService: ClientesService, public store: Store<AppState>, private router: Router
  ) { }

  @Effect()
  cargarClientes$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_CLIENTES),
      map((action: actions.CargarClientes) => action),
      switchMap(() => this.clientesService.getPersonasBasic()
        .pipe(
          map(response => new actions.CargarClientesSuccess(response)
          ),
          catchError(error => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              type: 'error',
              confirmButtonText: 'OK'
            });
            return of(new actions.CargarClientesFail(error));
          }
          ))
      )
    );

}