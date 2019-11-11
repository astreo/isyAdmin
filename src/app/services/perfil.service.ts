import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private get url() {
    return environment.apiUrl;
  }

  private get headers() { return this.utilService.getHeather(); }

  constructor(private http: HttpClient, private utilService: UtilService) { }

  getPerfiles() {
    return this.http.get(`${this.url}/Perfil`, { headers: this.headers, observe: 'response' })
      .pipe(
        map(
          (resp: any) => {
            return resp.body;
          }
        )
      )
      ;
  }
}
