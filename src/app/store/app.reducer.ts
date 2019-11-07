import * as reducers from './reducers';
import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';


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

/*export const getState = createFeatureSelector<reducers.perfil.State>('perfil');
export const getPerfilesState = createSelector(getState, (state: reducers.perfil.State) => state);
export const getPerfiles2 = createSelector(getPerfilesState, reducers.perfil.getPerfiles);

export const selectPerfilState = createFeatureSelector<reducers.perfil.State>('perfil');
export const getPerfiles = createSelector(selectPerfilState, reducers.perfil.getPerfiles);

export const selectUsuariosState = createFeatureSelector<reducers.usuarios.State>('users');
export const getUsuarios = createSelector(selectUsuariosState, reducers.usuarios.getUsuarios);*/


