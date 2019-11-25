export interface ClienteList {
  idPersona: number;
  nombres: string;
  apellidos: string;
  nroDocumento: string;
  telefono: string;
  email?: string;
  ruc: string;
  personaJuridica: string;
  esCliente?: any;
  esTitular: string;
  tienePanel?: any;
  tieneGps?: any;
  tieneCamara?: any;
  fechaCreacion: string;
  fechaCreacionUtc: string;
  dependientes: number;
  total: number;
}
