import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { AccountService } from './account.service';
import { map, switchMap } from 'rxjs/operators';
import { ZonaPeligrosa } from '../models/zonas-peligrosas.model';

@Injectable({
  providedIn: 'root'
})
export class ZonasPeligrosasService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getZonas() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/geocerca/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  addPunto(zona: ZonaPeligrosa) {
    console.log('addPunto: ' + JSON.stringify(zona));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          zona.idUsuarioWeb = data.idUsuario;
          zona.idProveedorWeb = data.idProveedor;
          return this.http.post(`${this.url}/Geocerca`, zona, { headers: this.headers, observe: 'response' })
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

  updateZona(zona: ZonaPeligrosa) {
    console.log('addPunto: ' + JSON.stringify(zona));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          zona.idUsuarioWeb = data.idUsuario;
          zona.idProveedorWeb = data.idProveedor;
          zona.idProveedor = data.idProveedor;
          return this.http.put(`${this.url}/Geocerca/${zona.idGeocerca}`, zona, { headers: this.headers, observe: 'response' })
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

  deleteZona(id: number) {
    return this.http.delete(`${this.url}/Geocerca/${id}`, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            console.log('service delete');
            console.log(resp);
            return resp.body;
          }
        )
      )
      ;
  }
}
