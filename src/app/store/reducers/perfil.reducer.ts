import { Perfil } from './../../models/usuarios.model';
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
        console.log('reducer cargar');
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_PERFILES_SUCCESS:
        console.log('reducer success');
        console.log(action.perfiles);
      return {
        ...state,
        loading: false,
        loaded: true,
        perfiles: [...action.perfiles ]
      };

    case actions.CARGAR_PERFILES_FAIL:
        console.log('reducer fail');
        console.log(action.payload);
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
