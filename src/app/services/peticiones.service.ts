import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { UtilService } from './util.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getPeticiones() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/SolicitudServicio/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  getDetalleEmergencia(idSolicitudServicio: number) {
    return this.http.get(`${this.url}/SolicitudServicio/${idSolicitudServicio}/emeper`, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                (resp: any) => {
                  return resp.body;
                }
              )
            )
            ;
  }

  getDetalleServicio(idSolicitudServicio: number) {
    return this.http.get(`${this.url}/SolicitudServicio/${idSolicitudServicio}`, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                (resp: any) => {
                  return resp.body;
                }
              )
            )
            ;
  }

}
