import * as reducers from './reducers';
import { ActionReducerMap } from '@ngrx/store';


export interface AppState {
  account: reducers.usuario.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  account: reducers.usuario.reducer
};
