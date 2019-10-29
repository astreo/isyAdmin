import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService) { }

  getUsers(idProveedor: number) {
    return this.http.get(`${this.url}/Usuario/proveedor/` + idProveedor, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            console.log('service');
            console.log(resp);
            return resp.body;
          }
        )
      )
      ;
  }
}
