// import { AppState } from './../app.reducer';
import { usuario as actions } from '../actions';
import { Usuario } from '../../models/usuario.model';

export interface State {
  usuario: Usuario;
  loaded: boolean;
  loading: boolean;
  authenticated: boolean;
  error: any;
}

/* export interface AppState extends AppState {
  account: State;
} */

const estadoInicial: State = {
  usuario: null,
  loaded: false,
  loading: false,
  authenticated: false,
  error: null
};

export function reducer(state = estadoInicial, action: actions.accion): State {
  // debugger;
  switch (action.type) {
    case actions.CARGAR_USUARIO:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_USUARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        authenticated: true,
        usuario: { ...action.usuario }
      };

    case actions.CARGAR_USUARIO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        authenticated: false,
        error: {
          status: action.payload.status,
          message: action.payload.message,
          url: action.payload.url
        }
      };

    default:
      return state;
  }
}
