import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginData } from '../models/usuario.model';
import { UtilService } from './util.service';
import { environment } from '../../environments/environment';
import { UsuarioNewPwd } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private get url() {
    return environment.url;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService) { }

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
}
