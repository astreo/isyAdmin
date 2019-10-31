import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/reducers/usuario.reducer';
import { usuarios as actions } from '../../../store/actions';
import { map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

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
  styleUrls: ['./users-list.component.scss'],
  providers: [DecimalPipe]
})
export class UsersListComponent implements OnInit, OnDestroy {
  loading: boolean;
  usuarios = {} as UsuariosLista[];
  usuarios$: Observable<UsuariosLista[]>;
  pageSize = 15;
  page = 1;
  accountSuscription = new Subscription();
  usersSuscription = new Subscription();
  filter = new FormControl('');

  constructor(public store: Store<AppState>, public pipe: DecimalPipe) { }

  ngOnInit() {
    this.accountSuscription = this.store.select('account')
      .subscribe(result => {
        this.getUsers(result.usuario.proveedor.idProveedor);
      });
  }

  ngOnDestroy() {
    this.accountSuscription.unsubscribe();
    this.usersSuscription.unsubscribe();
  }

  getUsers(idProveedor: number) {
    this.store.select('users')
    .pipe(
      map(item => ({ users: item.usuarios, loading: item.loading })),
      map(mappedItems => {
        return (({
          users: (mappedItems.users ? mappedItems.users : []).map(item => ({
            fechaCreacion: item.fechaCreacion, nombres: item.nombres, apellidos: item.apellidos, username: item.username,
            estado: item.estado, proveedor: item.proveedor.nombre, perfil: item.perfil.descripcion
          })),
          loading: mappedItems.loading
        })
        );
      }))
    .subscribe(mappedItems => {
      this.usuarios = mappedItems.users;
      this.loading = mappedItems.loading;
      this.usuarios$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
      console.log('subscribe');
    });
    this.store.dispatch(new actions.CargarUsuarios(idProveedor));
  }

  search(text: string, pipe: PipeTransform): UsuariosLista[] {
    return this.usuarios.filter(usuario => {
      const term = text.toLowerCase();
      return usuario.nombres.toLowerCase().includes(term)
          || usuario.apellidos.toLowerCase().includes(term)
          || usuario.username.toLowerCase().includes(term)
          || usuario.proveedor.toLowerCase().includes(term)
          || usuario.perfil.toLowerCase().includes(term)
          || usuario.fechaCreacion.includes(term)
          ;
    });
  }
}
