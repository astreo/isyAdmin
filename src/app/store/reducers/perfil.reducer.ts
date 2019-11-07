import { Perfil } from './../../models/perfil.model';
import { perfil as actions } from '../actions';

export interface State {
  perfiles: Perfil[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

const estadoInicial: State = {
  perfiles: null,
  loaded: false,
  loading: false,
  error: null
};

export function reducer(state = estadoInicial, action: actions.accion): State {
  switch (action.type) {
    case actions.CARGAR_PERFILES:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_PERFILES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        perfiles: [...action.perfiles ]
      };

    case actions.CARGAR_PERFILES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
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

export const getPerfiles = (state: State) => state.perfiles;
