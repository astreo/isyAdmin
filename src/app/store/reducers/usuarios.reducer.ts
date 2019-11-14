import { usuarios as actions } from '../actions';
import { UsuarioList } from '../../models/usuarios.model';

export interface State {
  usuarios: UsuarioList[];
  // usuario: UsuarioList;
  // id: number;
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
    case actions.ELIMINAR_USUARIO:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.ELIMINAR_USUARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        usuarios: [...state.usuarios.slice(0, action.usuario),
          ...state.usuarios.slice(action.usuario + 1)]
      };
    // --
    case actions.AGREGAR_USUARIO:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.AGREGAR_USUARIO_SUCCESS:
        console.log('nuevo usuario');
      console.log(action.usuario);
      return {
        ...state,
        loading: false,
        loaded: true,
        usuarios: [...state.usuarios, action.usuario]
      };

    case actions.AGREGAR_USUARIO_FAIL:
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
    // --
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
        usuarios: [...action.usuarios]
      };

    case actions.CARGAR_USUARIO_FAIL:
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
    // --
    case actions.ACTUALIZAR_USUARIO:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.ACTUALIZAR_USUARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        // usuarios: [...state.usuarios]
      };

    case actions.ACTUALIZAR_USUARIO_FAIL:
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

    case actions.CARGAR_USUARIOS:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_USUARIOS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        usuarios: [...action.usuarios]
      };

    case actions.CARGAR_USUARIOS_FAIL:
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

// export const getUsuarios = (state: State) => state.usuarios;
