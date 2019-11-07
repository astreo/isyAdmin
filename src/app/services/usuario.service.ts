import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  loaded$ = this.store.select(state => state.users.loaded);

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService, public store: Store<AppState>) { }

  getUsers(idProveedor: number) {
    return this.http.get(`${this.url}/Usuario/proveedor/` + idProveedor, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            console.log('getUsers Service');
            return resp.body;
          }
        )
      )
      ;
  }
}
