import { Action } from '@ngrx/store';
import { Cliente } from '../../models/cliente.model';

export const CARGAR_CLIENTES = '[clientes] Cargar clientes';
export const CARGAR_CLIENTES_FAIL = '[clientes] Cargar clientes FAIL';
export const CARGAR_CLIENTES_SUCCESS = '[clientes] Cargar clientes SUCCESS';

export const ACTUALIZAR_CLIENTE = '[clientes] Actualizar cliente';
export const ACTUALIZAR_CLIENTE_SUCCESS = '[clientes] Actualizar cliente SUCCESS';
export const ACTUALIZAR_CLIENTE_FAIL = '[clientes] Actualizar cliente FAIL';

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

// --

export class ActualizarUsuario implements Action {
  readonly type = ACTUALIZAR_CLIENTE;
  constructor(public cliente: Cliente) {}
}

export class ActualizarUsuarioSuccess implements Action {
  readonly type = ACTUALIZAR_CLIENTE_SUCCESS;
  // constructor(public usuario: UsuarioList) {}
}

export class ActualizarUsuarioFail implements Action {
  readonly type = ACTUALIZAR_CLIENTE_FAIL;
  constructor( public payload: any ) {}
}

export type accion = CargarClientes | CargarClientesSuccess | CargarClientesFail
                    | ActualizarUsuario | ActualizarUsuarioSuccess | ActualizarUsuarioFail
                    ;
