import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/reducers/usuario.reducer';
import { map } from 'rxjs/operators';

declare interface UsuariosLista {
  fechaCreacion: string;
  nombres: string;
  apellidos: string;
  username: string;
  estado: string;
  proveedor: string;
  perfil: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  loading: boolean;
  public usuarios = {} as UsuariosLista[];

  constructor(public store: Store<AppState>) { }

  ngOnInit() {
    /*this.store.select('users')
      .subscribe(result => {
        this.loading = result.loading;
      });
    this.store.dispatch(new actions.CargarUsuarios(8));*/

    this.store.select('users')
    .pipe(
      map(item => ({ users: item.usuarios, loading: item.loading })),
      map(mappedItems => {
        return mappedItems.users
        .map(item => ({
          fechaCreacion: item.fechaCreacion, nombres: item.nombres, apellidos: item.apellidos, username: item.username, estado: item.estado,
                      proveedor: item.proveedor.nombre, perfil: item.perfil.descripcion
        }));
      }))
    .subscribe(mappedItems => {
      this.usuarios = mappedItems;
    });
  }


}
