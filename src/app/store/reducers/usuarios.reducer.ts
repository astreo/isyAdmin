import { usuarios as actions } from '../actions';
import { UsuarioList } from '../../models/usuarios.model';


export interface State {
  usuarios: UsuarioList[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

const estadoInicial: State = {
  usuarios: null,
  loaded: false,
  loading: false,
  error: null
};

export function reducer(state = estadoInicial, action: actions.accion): State {
  switch (action.type) {
    case actions.CARGAR_USUARIOS:
        console.log('reducer cargar');
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_USUARIOS_SUCCESS:
        console.log('reducer success');
        console.log(action.usuarios);
      return {
        ...state,
        loading: false,
        loaded: true,
        usuarios: [...action.usuarios ]
      };

    case actions.CARGAR_USUARIOS_FAIL:
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
