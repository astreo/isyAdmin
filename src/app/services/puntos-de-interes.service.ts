import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { PuntoDeInteres } from '../models/puntos-de-interes.model';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PuntosDeInteresService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getPuntos() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/PuntoInteres/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  addPunto(punto: PuntoDeInteres) {
    console.log('addPunto: ' + JSON.stringify(punto));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          punto.idUsuarioWeb = data.idUsuario;
          punto.idProveedorWeb = data.idProveedor;
          return this.http.post(`${this.url}/PuntoInteres`, punto, { headers: this.headers, observe: 'response' })
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

  updatePunto(id: number, punto: PuntoDeInteres) {
    console.log('addPunto: ' + JSON.stringify(punto));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          punto.idUsuarioWeb = data.idUsuario;
          punto.idProveedorWeb = data.idProveedor;
          punto.idProveedor = data.idProveedor;
          punto.idPuntoInteres = id;
          return this.http.put(`${this.url}/PuntoInteres/${id}`, punto, { headers: this.headers, observe: 'response' })
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

  deletePunto(id: number) {
    return this.http.delete(`${this.url}/PuntoInteres/${id}`, { headers: this.headers, observe: 'response' })
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
