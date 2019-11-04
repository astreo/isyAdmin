export interface Perfil {
  idPerfil:             number;
  descripcion:          string;
  usuarioCreacion:      number;
  usuarioModificacion:  number | null;
  fechaCreacion:        string;
  fechaCreacionUtc:     string;
  fechaModificacion:    null | string;
  fechaModificacionUtc: null | string;
  estado:               Estado;
  check:                boolean;
  ver:                  boolean;
  crear:                boolean;
  editar:               boolean;
  eliminar:             boolean;
  perfilNivel:          any[];
  proveedor:            Proveedor[];
  idProveedorWeb:       number;
  idUsuarioWeb:         number;
  proveedorWeb:         null;
}

export enum Estado {
  A = 'A',
}

export interface Proveedor {
  idProveedor:          number;
  idTipoProveedor:      number;
  nombre:               string;
  alias:                string;
  direccion:            null | string;
  telefono:             string;
  email:                null | string;
  check:                boolean;
  celular:              null;
  urlLogo:              null | string;
  urlBandera:           null | string;
  pais:                 null | string;
  dominioPais:          DominioPais | null;
  sistemaSeguridad:     SistemaSeguridad | null;
  fileBytes:            null;
  fileBytesBand:        null;
  urlWebService:        null | string;
  linkWeb:              null | string;
  estado:               Estado;
  usuarioCreacion:      number | null;
  fechaCreacion:        string;
  fechaCreacionUtc:     null;
  usuarioModificacion:  number | null;
  fechaModificacionUtc: null;
  fechaModificacion:    null | string;
  tipoProveedor:        null;
  idProveedorWeb:       number;
  idUsuarioWeb:         number;
  proveedorWeb:         null;
}

export enum DominioPais {
  Ar = 'AR',
  MX = 'MX',
  Py = 'PY',
}

export enum SistemaSeguridad {
  Pw = 'PW',
  Sin = 'SIN',
}
