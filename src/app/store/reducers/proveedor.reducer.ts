import { Proveedor } from '../../models/proveedor.model';
import { proveedor as actions } from '../actions';

export interface State {
  proveedores: Proveedor[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

const estadoInicial: State = {
  proveedores: null,
  loaded: false,
  loading: false,
  error: null
};

export function reducer(state = estadoInicial, action: actions.accion): State {
  switch (action.type) {
    case actions.CARGAR_PROVEEDORES:
        console.log('reducer cargar proveedores');
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CARGAR_PROVEEDORES_SUCCESS:
        console.log('reducer success proveedores');
        console.log(action.proveedores);
      return {
        ...state,
        loading: false,
        loaded: true,
        proveedores: [...action.proveedores ]
      };

    case actions.CARGAR_PROVEEDORES_FAIL:
        console.log('reducer fail proveedores');
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
