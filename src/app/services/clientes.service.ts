import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  loaded$ = this.store.select(state => state.clientes.loaded);
  getUserSubscription = new Subscription();

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService,
    public store: Store<AppState>) { }

  getPersonasBasic() {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          return this.http.get(`${this.url}/persona/basic/` + data.idProveedor, { headers: this.headers, observe: 'response' })
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

  getTitular(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/persona/titular/${idPersona}/prov/${idProveedor}`,
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

  getDependientes(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/persona/dependientes/${idPersona}/prov/${idProveedor}`,
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

  getDispositivos(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/dispositivo/person/${idPersona}/prov/${idProveedor}`,
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

  getCodigoVerificacion(idPersona: number) {
    debugger;
    return this.http.get(`${this.url}/codigoVerificacion/person/${idPersona}`,
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

  getPersonaProveedor(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/PersonaProveedor/persona/${idPersona}/prov/${idProveedor}`,
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

  getPersonaPaneles(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/personapanel/person/${idPersona}/prov/${idProveedor}`,
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

  getPersonaGps(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/personagps/person/${idPersona}/prov/${idProveedor}`,
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

  getPersonaCamaras(idPersona: number) {
    return this.accountService.getProveedorId().pipe(
      switchMap(
        (idProveedor) => {
          return this.http.get(`${this.url}/personacamara/person/${idPersona}/prov/${idProveedor}`,
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
