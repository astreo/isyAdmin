import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {proveedor as actions} from '../actions';
import { of, pipe } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Injectable()
export class ProveedorEffects {

  constructor(
    private actions$: Actions, public proveedorService: ProveedorService
  ) { }

  @Effect()
  cargarProveedores$ = this.actions$
    .pipe(
      ofType(actions.CARGAR_PROVEEDORES),
      pipe(
        switchMap((action: actions.CargarProveedores) => {
          console.log('effects');
          return this.proveedorService.getProveedores(action.idProveedor)
            .pipe(
              map(proveedores => {
                // debugger;
                console.log('effect');
                console.log(proveedores);
                return new actions.CargarProveedoresSuccess(proveedores);
              }),
              catchError((error) => {
                Swal.fire({
                  title: 'Error!',
                  text: error.message,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
                return of(new actions.CargarProveedoresFail(error));
              })
            );
        })
      )
    );
}
