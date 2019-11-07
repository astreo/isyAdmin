import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { Observable } from 'rxjs';

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

  getUsers2(idProveedor: number): Observable<any> {
    let usuarios: Observable<any>;
    this.loaded$.subscribe(loaded => {
      console.log('loaded en servicio');
      console.log(loaded);
      if (!loaded) {
        usuarios = this.http.get(`${this.url}/Usuario/proveedor/` + idProveedor, { headers: this.headers, observe: 'response' })
          .pipe(
            map(
              (resp: any) => {
                console.log('getUsers from Server');
                return resp.body;
              }
            )
          )
          ;
      } else {
        usuarios =  this.store.select(state => state.users.usuarios), take(1);
        console.log('getUsers from Store');
      }
    });
    return usuarios;
  }
}
