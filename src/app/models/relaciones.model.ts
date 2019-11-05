import { Nivel } from './nivel.model';
import { Proveedor } from './proveedor.model';

export interface PerfilNivel {
  idPerfilNivel:       number;
  idPerfil:            number;
  idNivel:             number;
  ver:                 string;
  crear:               string;
  editar:              string;
  eliminar:            string;
  usuarioCreacion:     number;
  usuarioModificacion: null;
  fechaCreacion:       string;
  fechaModificacion:   null;
  nivel:               Nivel;
}

export interface PerfilProveedor {
  idPerfilProveedor: number;
  idPerfil:          number;
  idProveedor:       number;
  proveedor:         Proveedor[];
}
