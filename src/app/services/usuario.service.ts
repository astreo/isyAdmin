import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { UsuarioList, UsuarioListComp } from '../models/usuarios.model';
import { Subscription } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  loaded$ = this.store.select(state => state.users.loaded);
  getUserSubscription = new Subscription();

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, private accountService: AccountService,
              public store: Store<AppState>) { }

  getUsers(idProveedor: number) {
    return this.http.get(`${this.url}/Usuario/proveedor/` + idProveedor, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  deletetUser(idUsuario: number) {
    return this.http.delete(`${this.url}/Usuario/` + idUsuario, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  addUser(usuario: UsuarioListComp) {
    let userNew = {} as UsuarioList;
    userNew = Object.assign(userNew, usuario);
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          userNew.idUsuarioWeb = data.idUsuario;
          userNew.idProveedorWeb = data.idProveedor;
          return this.http.post(`${this.url}/Usuario`, userNew, { headers: this.headers, observe: 'response' })
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

  /*updateUser(usuarioList: UsuarioListComp) {
    return this.getUsersById(usuarioList.idUsuario).pipe(
      switchMap(
        (result: UsuarioList[]) => {
          console.log('updateUser');
          const usuario = result[0];
          usuario.nombres = usuarioList.nombres;
          usuario.apellidos = usuarioList.apellidos;
          usuario.idPerfil = usuario.perfil.idPerfil;
          usuario.idProveedor = usuario.proveedor.idProveedor;
          return this.http.put(`${this.url}/Usuario/` + usuario.idUsuario, usuario, { headers: this.headers, observe: 'response' })
            .pipe(
              map(
                () => {
                  console.log(usuario);
                  return usuario;
                }
              )
            )
            ;
        }
      )
    );
  }*/

  updateUser(usuarioList: UsuarioListComp) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          return this.getUsersById(usuarioList.idUsuario).pipe(
            switchMap(
              (result: UsuarioList[]) => {
                const usuario = result[0];
                usuario.nombres = usuarioList.nombres;
                usuario.apellidos = usuarioList.apellidos;
                usuario.idPerfil = usuario.perfil.idPerfil;
                usuario.idProveedor = usuario.proveedor.idProveedor;
                usuario.idUsuarioWeb = data.idUsuario;
                usuario.idProveedorWeb = data.idProveedor;
                return this.http.put(`${this.url}/Usuario/` + usuario.idUsuario, usuario, { headers: this.headers, observe: 'response' })

                  .pipe(
                    map(
                      () => {
                        return usuario;
                      }
                    )
                  )
                  ;
              }
            )
          );
        }
      )
    );
  }

  updatePassword(usuarioList: UsuarioListComp) {
    return this.accountService.getAccountData().pipe(
      switchMap(
        (data) => {
          return this.getUsersById(usuarioList.idUsuario).pipe(
            switchMap(
              (result: UsuarioList[]) => {

                const usuario = result[0];
                usuario.password = usuarioList.password;
                usuario.confirmPassword = usuarioList.confirmPassword;
                usuario.idUsuarioWeb = data.idUsuario;
                usuario.idProveedorWeb = data.idProveedor;
                return this.http.put(`${this.url}/Usuario/resetpass/` + usuario.idUsuario,
                  usuario, { headers: this.headers, observe: 'response' })
                  .pipe(
                    map(
                      () => {
                        return usuario;
                      }
                    )
                  )
                  ;
              }
            )
          );
        }
      )
    );
  }

  getUsersById(IdUsuario: number) {
    return this.store.select(state => state.users.usuarios).pipe(
      map(item => {
        return (
          // item
          item.filter(item1 => item1.idUsuario === IdUsuario)
          // .map(item2 => item2)
        );
      }));
  }

}
