import { Proveedor } from './proveedor.model';
import { Perfil } from './perfil.model';
import { PerfilNivel } from './relaciones.model';


export interface PerfilProveedor {
  idPerfilProveedor: number;
  idPerfil: number;
  idProveedor: number;
  proveedor: any[];
}

export interface UsuarioList {
  idUsuario: number;
  idPerfilProveedor: number;
  idPerfil?: any;
  idProveedor?: any;
  nombres: string;
  apellidos: string;
  nroDoc?: any;
  username: string;
  password: string;
  confirmPassword?: string;
  direccion?: any;
  email: string;
  telefono: string;
  usuarioCreacion: number;
  usuarioModificacion?: number;
  fechaCreacion: string;
  fechaCreacionUtc: Date;
  fechaModificacion: string;
  fechaModificacionUtc?: Date;
  estado: string;
  resetPassword: boolean;
  recordarme: boolean;
  perfilProveedor: PerfilProveedor;
  proveedor: Proveedor;
  perfil: Perfil;
  perfilNivel: PerfilNivel[];
  idProveedorWeb: number;
  idUsuarioWeb: number;
  proveedorWeb?: any;
}

export interface UsuarioListComp {
  fechaCreacion: string;
  nombres: string;
  apellidos: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  telefono: string;
  estado: string;
  idProveedor: number;
  proveedor: string;
  idPerfil: number;
  perfil: string;
}
