import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getClientesList(fechaInicio: string, fechaFin: string, tipo: string, myFecha: boolean) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(`${this.url}/reporte/desde/${fechaInicio}/hasta/${fechaFin}/tipo/${tipo}/myFecha/${myFecha}}/prov/${idProv}`,
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
      )
    );
  }

  getProductosPorClienteList(fechaInicio: string, fechaFin: string, tipo: string, myFecha: boolean) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(
            `${this.url}/reporte/desde/${fechaInicio}/hasta/${fechaFin}/tipoProducto/${tipo}/myFecha/${myFecha}/prov/${idProv}`,
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
      )
    );
  }

  getEstadisticaClientes(fecha: string) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(`${this.url}/reporte/desde/${fecha}/totales/prov/${idProv}`,
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
      )
    );
  }

  getAppUse(anho: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(`${this.url}/reporte/uso/${anho}/prov/${idProv}`,
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
      )
    );
  }


  getClientesPorPanel(id: string) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(`${this.url}/reporte/getByPanel/${id}/prov/${idProv}`,
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
      )
    );
  }

  getPortfolio(anho: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProv) => {
          return this.http.get(`${this.url}/reporte/cartera/anho/${anho}/prov/${idProv}`,
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
      )
    );
  }

}
