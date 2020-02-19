import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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
export class SidebarComponent implements OnInit, OnDestroy {
  public samplePagesCollapsed = true;
  public menu = {} as Menu[];
  subscription = new Subscription();

  constructor(public store: Store<AppState>, private translate: TranslateService) { }

  ngOnInit() {
    // this.cambiaIdioma('es');
    this.subscription = this.store.select('account')
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cambiaIdioma(idioma: string) {
    console.log(`Traduzco a: ${idioma}`);
    this.translate.use(idioma);
  }

}
