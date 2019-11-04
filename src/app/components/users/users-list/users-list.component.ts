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
  loading: boolean;
  usuarios = {} as UsuarioListComp[];
  usuarios$: Observable<UsuarioListComp[]>;
  pageSize = 10;
  page = 1;
  accountSuscription = new Subscription();
  usersSuscription = new Subscription();
  filter = new FormControl('');

  constructor(public store: Store<AppState>, public pipe: DecimalPipe, public modalService: NgbModal) { }

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
            fechaCreacion: item.fechaCreacion,
            nombres: item.nombres, apellidos: item.apellidos, username: item.username, email: item.email, telefono: item.telefono,
            estado: item.estado,
            idProveedor: item.proveedor.idProveedor, proveedor: item.proveedor.nombre,
            idPerfil: item.perfil.idPerfil, perfil: item.perfil.descripcion
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

  openModal(user: UsuarioListComp) {
    // const indice = this.usuarios.indexOf(user);
    const modalRef = this.modalService.open(UserComponent, { size: 'lg',  backdrop: 'static' });
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   console.log(receivedEntry);
    // })
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
