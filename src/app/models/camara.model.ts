export interface Camara {
  idCamara:      number;
  tipo:          string;
  nroSerie:      string;
  ip:            null;
  puertoHttp:    null;
  puertoRtsp:    null;
  rtspUri:       null;
  protocolo:     string;
  fechaCreacion: string;
  fechaPing:     null;
  estado:        null;
  idCamaraMbdb:  number;
  eventoCamara:  any[];
  personaCamara: any[];
}
