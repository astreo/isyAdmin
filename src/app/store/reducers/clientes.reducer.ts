import { clientes as actions } from '../actions';
import { Cliente } from '../../models/cliente.model';


export interface State {
  clientes: Cliente[];
  // usuario: UsuarioList;
  // id: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}

const estadoInicial: State = {
  clientes: null,
  loaded: false,
  loading: false,
  error: null
};

export function reducer(state = estadoInicial, action: actions.accion): State {
  switch (action.type) {
    case actions.CARGAR_CLIENTES:
      return {
        ...state,
        loading: true,
      };

    case actions.CARGAR_CLIENTES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        clientes: [...action.clientes]
      };

    case actions.CARGAR_CLIENTES_FAIL:
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

// export const getUsuarios = (state: State) => state.clientes;
