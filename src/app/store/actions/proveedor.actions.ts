import { Action } from '@ngrx/store';
import { Proveedor } from '../../models/proveedor.model';

export const CARGAR_PROVEEDORES = '[proveedores] Cargar proveedores';
export const CARGAR_PROVEEDORES_FAIL = '[proveedores] Cargar proveedores FAIL';
export const CARGAR_PROVEEDORES_SUCCESS = '[proveedores] Cargar proveedores SUCCESS';

export class CargarProveedores implements Action {
  readonly type = CARGAR_PROVEEDORES;
  constructor(public idProveedor: number) {}
}

export class CargarProveedoresFail implements Action {
  readonly type = CARGAR_PROVEEDORES_FAIL;
  constructor( public payload: any ) {}
}

export class CargarProveedoresSuccess implements Action {
  readonly type = CARGAR_PROVEEDORES_SUCCESS;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public proveedores: Proveedor[]) {}
}

export type accion = CargarProveedores | CargarProveedoresFail | CargarProveedoresSuccess;
