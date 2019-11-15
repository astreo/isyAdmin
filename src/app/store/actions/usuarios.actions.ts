import { UsuarioListComp } from './../../models/usuarios.model';
import { Action } from '@ngrx/store';
import { UsuarioList } from '../../models/usuarios.model';

export const ELIMINAR_USUARIO = '[usuarios] Eliminar usuario';
export const ELIMINAR_USUARIO_SUCCESS = '[usuarios] Eliminar usuario SUCCESS';
export const ELIMINAR_USUARIO_FAIL = '[usuarios] Eliminar usuario FAIL';

export const AGREGAR_USUARIO = '[usuarios] Agregar usuario';
export const AGREGAR_USUARIO_SUCCESS = '[usuarios] Agregar usuario SUCCESS';
export const AGREGAR_USUARIO_FAIL = '[usuarios] Agregar usuario FAIL';

export const ACTUALIZAR_USUARIO = '[usuarios] Actualizar usuario';
export const ACTUALIZAR_USUARIO_SUCCESS = '[usuarios] Actualizar usuario SUCCESS';
export const ACTUALIZAR_USUARIO_FAIL = '[usuarios] Actualizar usuario FAIL';

export const CARGAR_USUARIO = '[usuarios] Cargar usuario';
export const CARGAR_USUARIO_FAIL = '[usuarios] Cargar usuario FAIL';
export const CARGAR_USUARIO_SUCCESS = '[usuarios] Cargar usuario SUCCESS';

export const CARGAR_USUARIOS = '[usuarios] Cargar usuarios';
export const CARGAR_USUARIOS_FAIL = '[usuarios] Cargar usuarios FAIL';
export const CARGAR_USUARIOS_SUCCESS = '[usuarios] Cargar usuarios SUCCESS';

export class EliminarUsuario implements Action {
  readonly type = ELIMINAR_USUARIO;
  constructor(public idUsuario: number) {}
}

export class EliminarUsuarioSuccess implements Action {
  readonly type = ELIMINAR_USUARIO_SUCCESS;
  constructor(public idUsuario: number) {}
}

export class EliminarUsuarioFail implements Action {
  readonly type = ELIMINAR_USUARIO_FAIL;
  constructor( public payload: any ) {}
}

// ---
export class AgregarUsuario implements Action {
  readonly type = AGREGAR_USUARIO;
  constructor(public usuario: UsuarioListComp) {}
}

export class AgregarUsuarioSuccess implements Action {
  readonly type = AGREGAR_USUARIO_SUCCESS;
  constructor(public usuario: UsuarioList) {}
}

export class AgregarUsuarioFail implements Action {
  readonly type = AGREGAR_USUARIO_FAIL;
  constructor( public payload: any ) {}
}
// ---

export class ActualizarUsuario implements Action {
  readonly type = ACTUALIZAR_USUARIO;
  constructor(public usuario: UsuarioListComp) {}
}

export class ActualizarUsuarioSuccess implements Action {
  readonly type = ACTUALIZAR_USUARIO_SUCCESS;
  // constructor(public usuario: UsuarioList) {}
}

export class ActualizarUsuarioFail implements Action {
  readonly type = ACTUALIZAR_USUARIO_FAIL;
  constructor( public payload: any ) {}
}

export class CargarUsuario implements Action {
  readonly type = CARGAR_USUARIO;
  constructor(public idProveedor: number) {}
}

export class CargarUsuarioFail implements Action {
  readonly type = CARGAR_USUARIO_FAIL;
  constructor( public payload: any ) {}
}

export class CargarUsuarioSuccess implements Action {
  readonly type = CARGAR_USUARIO_SUCCESS;
  constructor(public usuarios: UsuarioList[]) {}
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
  constructor(public usuarios: UsuarioList[]) {}
}

export type accion = EliminarUsuario | EliminarUsuarioSuccess | EliminarUsuarioFail
                  | AgregarUsuario | AgregarUsuarioSuccess | AgregarUsuarioFail
                  | ActualizarUsuario | ActualizarUsuarioSuccess | ActualizarUsuarioFail
                  | CargarUsuario | CargarUsuarioSuccess | CargarUsuarioFail
                  | CargarUsuarios | CargarUsuariosSuccess | CargarUsuariosFail;
