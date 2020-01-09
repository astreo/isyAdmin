import { Action } from '@ngrx/store';
import { Cliente } from '../../models/cliente.model';

export const CARGAR_CLIENTES = '[clientes] Cargar clientes';
export const CARGAR_CLIENTES_FAIL = '[clientes] Cargar clientes FAIL';
export const CARGAR_CLIENTES_SUCCESS = '[clientes] Cargar clientes SUCCESS';

export class CargarClientes implements Action {
  readonly type = CARGAR_CLIENTES;
  constructor() {}
}

export class CargarClientesFail implements Action {
  readonly type = CARGAR_CLIENTES_FAIL;
  constructor( public payload: any ) {}
}

export class CargarClientesSuccess implements Action {
  readonly type = CARGAR_CLIENTES_SUCCESS;
  constructor(public clientes: Cliente[]) {}
}

export type accion = CargarClientes | CargarClientesSuccess | CargarClientesFail;
