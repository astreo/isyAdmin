import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

declare interface Menu {
  idPerfil: number;
  descripcion: string;
  recurso: string;
  icono: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  public menu = {} as Menu[];

  constructor(public store: Store<AppState>, private translate: TranslateService) { }

  ngOnInit() {

    this.store.select('account')
      .pipe(
        map(item => ({ menu: item.usuario.perfilNivel })),
        map(mappedItems => {
          return mappedItems.menu
          .map(item => ({
            idPerfil: item.idPerfil, descripcion: item.nivel.descripcion, recurso: item.nivel.recurso, icono: item.nivel.icono
          }));
        }))
      .subscribe(mappedItems => {
        this.menu = mappedItems;
      });

  }

  cambiaIdioma(idioma: string) {
    console.log(`Traduzco a: ${idioma}`);
    this.translate.use(idioma);
  }

}
