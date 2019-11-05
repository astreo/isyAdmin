export interface Nivel {
  idNivel:              number;
  descripcion:          string;
  recurso:              string;
  url:                  string;
  estado:               string;
  icono:                string;
  usuarioCreacion:      number;
  usuarioModificacion:  number;
  fechaCreacion:        string;
  fechaCreacionUtc:     null;
  fechaModificacion:    string;
  fechaModificacionUtc: null;
  perfil:               any[];
  idProveedorWeb:       number;
  idUsuarioWeb:         number;
  proveedorWeb:         null;
}
