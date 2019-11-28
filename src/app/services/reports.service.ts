import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService) { }

  getClientesList(fechaInicio: string, fechaFin: string, tipo: string, myFecha: boolean) {
    return this.http.get(`${this.url}/reporte/desde/${fechaInicio}/hasta/${fechaFin}/tipo/${tipo}/myFecha/${myFecha}`,
     { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  getProductosporClienteList(fechaInicio: string, fechaFin: string, tipo: string, myFecha: boolean) {
    return this.http.get(`${this.url}/reporte/desde/${fechaInicio}/hasta/${fechaFin}/tipoProducto/${tipo}/myFecha/${myFecha}`,
     { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  getEstadisticaClientes(fecha: string) {
    return this.http.get(`${this.url}/reporte/desde/${fecha}/totales`,
     { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  getAppUse(anho: number) {
    return this.http.get(`${this.url}/reporte/uso/${anho}`,
     { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  getClientesList3(fechaInicio: string, fechaFin: string, tipo: string, myFecha: boolean) {
    return this.http.get(`${this.url}/reporte/desde/${fechaInicio}/hasta/${fechaFin}/tipo/${tipo}/myFecha/${myFecha}`,
     { headers: this.headers, observe: 'response' });

  }
}
