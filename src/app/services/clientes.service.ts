import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { AccountService } from './account.service';
import { Cliente, ClienteVM } from '../models/cliente.model';
import { PersonaProveedor } from '../models/relaciones.model';

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

  getPersona(idPersona: number) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          return this.http.get(`${this.url}/persona/` + idPersona, { headers: this.headers, observe: 'response' })
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
    // debugger;
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

  updatePersona(cliente: Cliente) {
    const clienteVM = {} as  ClienteVM;
    Object.assign(clienteVM, cliente);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          clienteVM.idUsuarioWeb = data.idUsuario;
          clienteVM.idProveedorWeb = data.idProveedor;
          // panel.idPuntoInteres = id;
          return this.http.put(`${this.url}/Persona/` + clienteVM.idPersona, clienteVM, { headers: this.headers, observe: 'response' })
          .pipe(
            map(
              () => {
                return cliente;
              }
            )
          )
            ;
        }
      )
    );
  }

  updateTitular(idPersona: number, idTitular: number) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          // panel.idProveedorWeb = data.idProveedor;
          return this.http.put(`${this.url}/Persona/${idPersona}/changeTitular/${idTitular}/prov/${data.idProveedor}`,
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

  updatePersonaProveedor(personaProveedor: PersonaProveedor) {
    // const clienteVM = {} as  ClienteVM;
    // Object.assign(clienteVM, cliente);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          personaProveedor.idUsuarioWeb = data.idUsuario;
          personaProveedor.idProveedorWeb = data.idProveedor;
          // panel.idPuntoInteres = id;
          return this.http.put(`${this.url}/PersonaProveedor/` + personaProveedor.idPersonaProveedor, personaProveedor,
                               { headers: this.headers, observe: 'response' })
          .pipe(
            map(
              () => {
                return personaProveedor;
              }
            )
          )
            ;
        }
      )
    );
  }

  deletePersonaProveedor(personaProveedor: PersonaProveedor) {
    // const clienteVM = {} as  ClienteVM;
    // Object.assign(clienteVM, cliente);

            const httpOptions = {
                headers: this.headers,
                body: personaProveedor
            };
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          personaProveedor.idUsuarioWeb = data.idUsuario;
          personaProveedor.idProveedorWeb = data.idProveedor;
          // panel.idPuntoInteres = id;
          return this.http.delete(`${this.url}/PersonaProveedor/${personaProveedor.idPersonaProveedor}`,
          httpOptions)
          .pipe(
            map(
              () => {
                return personaProveedor;
              }
            )
          )
            ;
        }
      )
    );
  }

}
