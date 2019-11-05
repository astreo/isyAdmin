import { Proveedor } from './proveedor.model';

export interface Perfil {
  idPerfil: number;
  descripcion: string;
  usuarioCreacion: number;
  usuarioModificacion?: number;
  fechaCreacion: string;
  fechaCreacionUtc?: any;
  fechaModificacion: string;
  fechaModificacionUtc?: any;
  estado: string;
  check: boolean;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  perfilNivel: any[];
  proveedor: Proveedor[];
  idProveedorWeb: number;
  idUsuarioWeb: number;
  proveedorWeb?: any;
}

