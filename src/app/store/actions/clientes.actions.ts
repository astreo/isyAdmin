import { Action } from '@ngrx/store';
import { Cliente, ClienteVM } from '../../models/cliente.model';

export const CARGAR_CLIENTES = '[clientes] Cargar clientes';
export const CARGAR_CLIENTES_FAIL = '[clientes] Cargar clientes FAIL';
export const CARGAR_CLIENTES_SUCCESS = '[clientes] Cargar clientes SUCCESS';

export const AGREGAR_CLIENTE = '[clientes] Agregar cliente';
export const AGREGAR_CLIENTE_SUCCESS = '[clientes] Agregar cliente SUCCESS';
export const AGREGAR_CLIENTE_FAIL = '[clientes] Agregar cliente FAIL';

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

export class ActualizarCliente implements Action {
  readonly type = ACTUALIZAR_CLIENTE;
  constructor(public cliente: Cliente) {}
}

export class ActualizarClienteSuccess implements Action {
  readonly type = ACTUALIZAR_CLIENTE_SUCCESS;
  // constructor(public cliente: ClienteList) {}
}

export class ActualizarClienteFail implements Action {
  readonly type = ACTUALIZAR_CLIENTE_FAIL;
  constructor( public payload: any ) {}
}

// --

export class AgregarCliente implements Action {
  readonly type = AGREGAR_CLIENTE;
  constructor(public cliente: ClienteVM) {}
}

export class AgregarClienteSuccess implements Action {
  readonly type = AGREGAR_CLIENTE_SUCCESS;
  constructor(public cliente: Cliente) {}
}

export class AgregarClienteFail implements Action {
  readonly type = AGREGAR_CLIENTE_FAIL;
  constructor( public payload: any ) {}
}

export type accion = CargarClientes | CargarClientesSuccess | CargarClientesFail
                    | ActualizarCliente | ActualizarClienteSuccess | ActualizarClienteFail
                    | AgregarCliente | AgregarClienteSuccess | AgregarClienteFail
                    ;
