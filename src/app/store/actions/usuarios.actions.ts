import { Action } from '@ngrx/store';
import { UsuarioList } from '../../models/usuarios.model';

export const CARGAR_USUARIOS = '[usuarios] Cargar usuarios';
export const CARGAR_USUARIOS_FAIL = '[usuarios] Cargar usuarios FAIL';
export const CARGAR_USUARIOS_SUCCESS = '[usuarios] Cargar usuarios SUCCESS';

export class CargarUsuarios implements Action {
  readonly type = CARGAR_USUARIOS;
  constructor(public idProveedor: number) {}
}

export class CargarUsuariosFail implements Action {
  readonly type = CARGAR_USUARIOS_FAIL;
  constructor( public payload: any ) {}
}

export class CargarUsuariosSuccess implements Action {
  readonly type = CARGAR_USUARIOS_SUCCESS;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public usuarios: UsuarioList[]) {}
}

export type accion = CargarUsuarios | CargarUsuariosFail | CargarUsuariosSuccess;
