import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { PuntoDeInteres } from '../models/puntos-de-interes';
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

  getPuntos(idProveedor: number) {
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

  addPunto2(punto: PuntoDeInteres) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {

          punto.idUsuarioWeb = data.idUsuario;
          punto.idProveedorWeb = data.idProveedor;
          return this.http.post(`${this.url}/PuntoInteres`, punto, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                () => {
                  console.log(punto);
                  return punto;
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
          console.log('AccountData: ' + JSON.stringify(data));
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
}
