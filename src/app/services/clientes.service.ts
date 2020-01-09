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


  /*getCustomerById(IdUsuario: number) {
    return this.store.select(state => state.clientes.usuarios).pipe(
      map(item => {
        return (
          // item
          item.filter(item1 => item1.idUsuario === IdUsuario)
          // .map(item2 => item2)
        );
      }));
  }*/

}
