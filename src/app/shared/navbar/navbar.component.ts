import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

declare interface LoggedUser {
  nombre: string;
  proveedor: string;
  urlLogo: string;
}


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public sidebarOpened = false;
  public loggedUser = {} as LoggedUser;
  subscription = new Subscription();


  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    } else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  constructor(private translate: TranslateService, private router: Router, config: NgbDropdownConfig, public store: Store<AppState>) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    // this.cambiaIdioma('en');
    /*this.store.select('account')
      .subscribe(result => {
        this.loggedUser.nombre = result.usuario.nombres + ' ' + result.usuario.apellidos;
      });*/


      this.subscription = this.store.select('account')
      .pipe(
        map(item => ({
          nombre: (item.usuario.nombres + ' ' + item.usuario.apellidos),
          proveedor: item.usuario.proveedor.nombre,
          urlLogo: item.usuario.proveedor.urlLogo
        })),
        )
      .subscribe(mappedItems => {
        this.loggedUser = mappedItems;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cambiaIdioma(idioma: string) {
    console.log(`Traduzco a: ${idioma}`);
    this.translate.use(idioma);
  }

  close() {
    console.log('salir');
    this.router.navigate(['/login']);
  }

}
