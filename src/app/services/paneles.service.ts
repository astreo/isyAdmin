import { Panel } from './../models/paneles.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { AccountService } from './account.service';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PanelesService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getPaneles() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/panel/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  addPanel(panel: Panel) {
    console.log('addPunto: ' + JSON.stringify(panel));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          panel.idPanel = 0;
          panel.idUsuarioWeb = data.idUsuario;
          panel.idProveedorWeb = data.idProveedor;
          panel.idProveedor = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            panel: panel,
            proveedor: proveedor
          };
          debugger;
          // panel.idPuntoInteres = id;
          return this.http.post(`${this.url}/panel/`, info, { headers: this.headers, observe: 'response' })
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

  updatePanel(panel: Panel) {
    console.log('addPunto: ' + JSON.stringify(panel));
    // let userNew = {} as UsuarioList;
    // userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          console.log('AccountData: ' + JSON.stringify(data));
          panel.idUsuarioWeb = data.idUsuario;
          panel.idProveedorWeb = data.idProveedor;
          panel.idProveedor = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            panel: panel,
            proveedor: proveedor
          };
          debugger;
          // panel.idPuntoInteres = id;
          return this.http.put(`${this.url}/panel/${panel.idPanel}`, info, { headers: this.headers, observe: 'response' })
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
