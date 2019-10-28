import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { map } from 'rxjs/operators';

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
export class NavbarComponent implements OnInit {
  public sidebarOpened = false;
  public loggedUser = {} as LoggedUser;


  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    } else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  constructor(config: NgbDropdownConfig, public store: Store<AppState>) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.store.select('account')
      .subscribe(result => {
        this.loggedUser.nombre = result.usuario.nombres + ' ' + result.usuario.apellidos;
      });


      this.store.select('account')
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

}
