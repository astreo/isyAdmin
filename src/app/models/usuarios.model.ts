

  export interface PerfilProveedor {
      idPerfilProveedor: number;
      idPerfil: number;
      idProveedor: number;
      proveedor: any[];
  }

  export interface Proveedor {
      idProveedor: number;
      idTipoProveedor: number;
      nombre: string;
      alias: string;
      direccion: string;
      telefono: string;
      email: string;
      check: boolean;
      celular?: any;
      urlLogo: string;
      urlBandera: string;
      pais?: any;
      dominioPais: string;
      sistemaSeguridad: string;
      fileBytes?: any;
      fileBytesBand?: any;
      urlWebService: string;
      linkWeb: string;
      estado: string;
      usuarioCreacion: number;
      fechaCreacion: string;
      fechaCreacionUtc?: any;
      usuarioModificacion: number;
      fechaModificacionUtc?: any;
      fechaModificacion: string;
      tipoProveedor?: any;
      idProveedorWeb: number;
      idUsuarioWeb: number;
      proveedorWeb?: any;
  }

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
      proveedor: any[];
      idProveedorWeb: number;
      idUsuarioWeb: number;
      proveedorWeb?: any;
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
      confirmPassword?: any;
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
      perfilNivel: any[];
      idProveedorWeb: number;
      idUsuarioWeb: number;
      proveedorWeb?: any;
  }
