import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { usuarios as actions } from '../../../store/actions';
import { map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from '../user/user.component';
import { UsuarioListComp } from 'src/app/models/usuarios.model';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [DecimalPipe]
})
export class UsersListComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  usuarios = {} as UsuarioListComp[];
  usuarios$: Observable<UsuarioListComp[]>;

  loaded$ = this.store.select(state => state.users.loaded);

  pageSize = 10;
  page = 1;
  accountSubscription = new Subscription();
  getUsersFromStoreSubscription  = new Subscription();
  filter = new FormControl('');

  constructor(public store: Store<AppState>, public pipe: DecimalPipe, public modalService: NgbModal) { }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.users.loading);
    this.loaded$.subscribe(loaded => {
      if (!loaded) {
        this.accountSubscription = this.store.select('account')
          .subscribe(result => {
            this.store.dispatch(new actions.CargarUsuarios(result.usuario.proveedor.idProveedor));
          });
      } else {
        this.getUsersFromStore();
      }
    });
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
    this.getUsersFromStoreSubscription.unsubscribe();
  }


  getUsersFromStore() {
    this.store.select(state => state.users.usuarios).pipe(map((item) => {
      return (
        // tslint:disable-next-line: no-shadowed-variable
        item.map(item => ({
          idUsuario: item.idUsuario,
          fechaCreacion: item.fechaCreacion,
          nombres: item.nombres, apellidos: item.apellidos, username: item.username, email: item.email, telefono: item.telefono,
          estado: item.estado,
          idProveedor: item.proveedor.idProveedor, proveedor: item.proveedor.nombre,
          idPerfil: item.perfil.idPerfil, perfil: item.perfil.descripcion,
          password: '', confirmPassword: ''
        }))
      );
    })).subscribe(mappedItems => {
      this.usuarios = mappedItems;
      this.usuarios$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
    });
  }

  getUsersFromServer(idProveedor: number) {
    this.store.select('users')
      .pipe(
        map(item => ({ users: item.usuarios, loading: item.loading })),
        map(mappedItems => {
          return (({
            users: (mappedItems.users ? mappedItems.users : []).map(item => ({
              idUsuario: item.idUsuario,
              fechaCreacion: item.fechaCreacion,
              nombres: item.nombres, apellidos: item.apellidos, username: item.username, email: item.email, telefono: item.telefono,
              estado: item.estado,
              idProveedor: item.proveedor.idProveedor, proveedor: item.proveedor.nombre,
              idPerfil: item.perfil.idPerfil, perfil: item.perfil.descripcion,
              password: '', confirmPassword: ''
            })),
            loading: mappedItems.loading
          })
          );
        }))
      .subscribe(mappedItems => {
        this.usuarios = mappedItems.users;
        // this.loading = mappedItems.loading;
        this.usuarios$ = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text, this.pipe))
        );
      });
    this.store.dispatch(new actions.CargarUsuarios(idProveedor));
  }

  openModal(user: UsuarioListComp) {
    // const indice = this.usuarios.indexOf(user);
    const modalRef = this.modalService.open(UserComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.user = user;
    modalRef.result.then((result: UsuarioListComp) => {
      // debugger;
      if (result) {
        // console.log('Modelo: ' + JSON.stringify(result));
        if (user) {
          user = Object.assign(user, result);
          this.store.dispatch(new actions.ActualizarUsuario(user));
        }
        // user.nombres = 'hola';
      }
    });
  }

  search(text: string, pipe: PipeTransform): UsuarioListComp[] {
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
