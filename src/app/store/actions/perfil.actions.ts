import { Action } from '@ngrx/store';
import { Perfil } from 'src/app/models/perfil.model';

export const CARGAR_PERFILES = '[perfiles] Cargar perfiles';
export const CARGAR_PERFILES_FAIL = '[perfiles] Cargar perfiles FAIL';
export const CARGAR_PERFILES_SUCCESS = '[perfiles] Cargar perfiles SUCCESS';

export class CargarPerfiles implements Action {
  readonly type = CARGAR_PERFILES;
  constructor() {}
  // constructor(public idProveedor: number) {}
}

export class CargarPerfilesFail implements Action {
  readonly type = CARGAR_PERFILES_FAIL;
  constructor( public payload: any ) {}
}

export class CargarPerfilesSuccess implements Action {
  readonly type = CARGAR_PERFILES_SUCCESS;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public perfiles: Perfil[]) {}
}

export type accion = CargarPerfiles | CargarPerfilesFail | CargarPerfilesSuccess;
