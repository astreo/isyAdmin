import * as reducers from './reducers';
import { ActionReducerMap } from '@ngrx/store';


export interface AppState {
  account: reducers.usuario.State;
  users: reducers.usuarios.State;
  perfil: reducers.perfil.State;
  proveedor: reducers.proveedor.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  account: reducers.usuario.reducer,
  users: reducers.usuarios.reducer,
  perfil: reducers.perfil.reducer,
  proveedor: reducers.proveedor.reducer,
};
