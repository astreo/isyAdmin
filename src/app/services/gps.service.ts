import { Gps } from './../models/gps.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { AccountService } from './account.service';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getGpsList() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/gps/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  addGps(gps: Gps) {
    console.log('addPunto: ' + JSON.stringify(gps));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          gps.idGps = 0;
          gps.idUsuarioWeb = data.idUsuario;
          gps.idProveedorWeb = data.idProveedor;
          gps.idProveedor = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            gps: gps,
            proveedor: proveedor
          };
          debugger;
          // gps.idPuntoInteres = id;
          return this.http.post(`${this.url}/gps/`, info, { headers: this.headers, observe: 'response' })
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

  updateGps(gps: Gps) {
    console.log('addPunto: ' + JSON.stringify(gps));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          gps.idUsuarioWeb = data.idUsuario;
          gps.idProveedorWeb = data.idProveedor;
          gps.idProveedor = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            gps: gps,
            proveedor: proveedor
          };
          debugger;
          // gps.idPuntoInteres = id;
          return this.http.put(`${this.url}/gps/${gps.idGps}`, info, { headers: this.headers, observe: 'response' })
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
