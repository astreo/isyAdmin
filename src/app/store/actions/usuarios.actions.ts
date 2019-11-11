import { UsuarioListComp } from './../../models/usuarios.model';
import { Action } from '@ngrx/store';
import { UsuarioList } from '../../models/usuarios.model';

export const ACTUALIZAR_USUARIO = '[usuarios] Actualizar usuario';
export const ACTUALIZAR_USUARIO_SUCCESS = '[usuarios] Actualizar usuario SUCCESS';
export const CARGAR_USUARIOS = '[usuarios] Cargar usuarios';
export const CARGAR_USUARIOS_FAIL = '[usuarios] Cargar usuarios FAIL';
export const CARGAR_USUARIOS_SUCCESS = '[usuarios] Cargar usuarios SUCCESS';

export class ActualizarUsuario implements Action {
  readonly type = ACTUALIZAR_USUARIO;
  constructor(public usuario: UsuarioListComp) {}
}

export class ActualizarUsuarioSuccess implements Action {
  readonly type = ACTUALIZAR_USUARIO_SUCCESS;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public usuario: UsuarioList) {}
}

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

export type accion = ActualizarUsuario | ActualizarUsuarioSuccess | CargarUsuarios | CargarUsuariosFail | CargarUsuariosSuccess;
