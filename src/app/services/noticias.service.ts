import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { AccountService } from './account.service';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService) { }

  getNoticias() {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/noticia/proveedor/${idProveedor}`, { headers: this.headers, observe: 'response' })
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

  addNoticia(noticia: Noticia) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          noticia.idNoticia = 0;
          noticia.idUsuarioWeb = data.idUsuario;
          noticia.idProveedorWeb = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            noticia: noticia,
            proveedor: proveedor
          };
          // panel.idPuntoInteres = id;
          return this.http.post(`${this.url}/noticia/`, info, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                () => {
                  return noticia;
                }
              )
            )
            ;
        }
      )
    );
  }

  updateNoticia(id: number, noticia: Noticia) {
    console.log('updateNoticia: ' + JSON.stringify(noticia));
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          noticia.idUsuarioWeb = data.idUsuario;
          noticia.idProveedorWeb = data.idProveedor;
          noticia.idProveedor = data.idProveedor;
          noticia.idNoticia = id;

          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };

          const info = {
            noticia: noticia,
            proveedor: proveedor
          };

          return this.http.put(`${this.url}/noticia/${id}`, info, { headers: this.headers, observe: 'response' })
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

  deleteNoticia(id: number) {
    return this.http.delete(`${this.url}/noticia/${id}`, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  sendNoticia(noticia: Noticia) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          noticia.idUsuarioWeb = data.idUsuario;
          noticia.idProveedorWeb = data.idProveedor;
          const proveedor = {
            nombreProveedor: data.nombreProveedor,
            aliasProveedor: data.aliasProveedor
          };
          const info = {
            noticia: noticia,
            proveedor: proveedor
          };
          // panel.idPuntoInteres = id;
          return this.http.post(`${this.url}/noticia/send`, info, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                () => {
                  return noticia;
                }
              )
            )
            ;
        }
      )
    );
  }
}
