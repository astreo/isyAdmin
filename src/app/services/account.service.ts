import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginData } from '../models/usuario.model';
import { UtilService } from './util.service';
import { environment } from '../../environments/environment';
import { UsuarioNewPwd } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private get url() {
    return environment.url;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, public store: Store<AppState>) { }

  login(loginData: LoginData) {
    return this.http.post(`${this.url}/Account/Login`, loginData, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }

  updatePwd(model: UsuarioNewPwd) {
    console.log(model, 'resetPwd');
    return this.http.put(`${this.url}/Account/ResetPassword`, model, { headers: this.headers, observe: 'response' });
  }

  getProveedorId() {
    return this.store.select(state => state.account.usuario.proveedor.idProveedor);
  }

  getAccountData() {
    console.log('Entrando en getAccountData');
    return this.store.select(state => state.account.usuario).pipe(
      map(item => {
        console.log('Saliendo de AccountData: ' + JSON.stringify(item));
        return (
          {
            idUsuario: item.idUsuario,
            idProveedor: item.proveedor.idProveedor
          }
        );
      })
    );
  }
}
