import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { usuarios as actions } from '../../../store/actions';
import { map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent, FormObject } from '../user/user.component';
import { UsuarioListComp } from 'src/app/models/usuarios.model';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { FormType } from '../../../models/enum';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [DecimalPipe]
})
export class UsersListComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  // formObject: FormObject;
  FormType = FormType;
  formType: FormType;
  loading$: Observable<boolean>;
  usuarios = {} as UsuarioListComp[];
  usuarios$: Observable<UsuarioListComp[]>;
  loaded$ = this.store.select(state => state.users.loaded);

  loadedSubsctiption = new Subscription();
  accountSubscription = new Subscription();
  getUsersFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');
  date1Filter = new FormControl('');

  constructor(public store: Store<AppState>, public pipe: DecimalPipe, public modalService: NgbModal,
    public confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.users.loading);
    this.loadedSubsctiption = this.loaded$.subscribe(loaded => {
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
    this.loadedSubsctiption.unsubscribe();
  }


  getUsersFromStore() {
    debugger;
    this.getUsersFromStoreSubscription = this.store.select(state => state.users.usuarios).pipe(map((item) => {
      return (
        // tslint:disable-next-line: no-shadowed-variable
        item.map(item => ({
          idUsuario: item.idUsuario,
          fechaCreacion: item.fechaCreacion,
          nombres: item.nombres, apellidos: item.apellidos, username: item.username, email: item.email, telefono: item.telefono,
          estado: item.estado,
          idProveedor: item.proveedor.idProveedor, descProveedor: item.proveedor.nombre,
          idPerfil: item.perfil.idPerfil, descPerfil: item.perfil.descripcion,
          password: '', confirmPassword: ''
        }))
      );
    })).subscribe(mappedItems => {
      this.usuarios = mappedItems;
      this.usuarios$ = this.textFilter.valueChanges.pipe(
        startWith(''),
        map(text => this.searchText(text, this.pipe))
      );
      /*this.usuarios$ = this.date1Filter.valueChanges.pipe(
        startWith(''),
        map(date => this.searchDate(date, this.pipe))
      );*/
    });
  }

  openModal(formObject: FormObject, formType: FormType, user?: UsuarioListComp) {
    if (!user) {
      user = {} as UsuarioListComp;
    }
    const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(UserComponent, { size: size, backdrop: 'static' });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.formObject = formObject;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: UsuarioListComp) => {
      if (result) {
        // console.log('Modelo: ' + JSON.stringify(result));
        if (formObject === FormObject.PASSWORD) {
          this.store.dispatch(new actions.ActualizarPassword(Object.assign(user, result)));
        } else {
          if (user.idUsuario) {
            // user = Object.assign(user, result);
            this.store.dispatch(new actions.ActualizarUsuario(Object.assign(user, result)));
          } else {
            this.store.dispatch(new actions.AgregarUsuario(result));
          }
        }
      }
    });
  }

  openConfirmationDialog(user: UsuarioListComp) {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el usuario "${user.username}" de ${user.nombres} ${user.apellidos}?`)
      .then((result) => {
        if (result) {
          if (user) {
            // user = Object.assign(user, result);
            // debugger;
            this.store.dispatch(new actions.EliminarUsuario(user.idUsuario));
          }
        }
      });
    // .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  searchText(text: string, pipe: PipeTransform): UsuarioListComp[] {
    return this.usuarios.filter(usuario => {
      const term = text.toLowerCase();
      return usuario.nombres.toLowerCase().includes(term)
        || usuario.apellidos.toLowerCase().includes(term)
        || usuario.username.toLowerCase().includes(term)
        || usuario.descProveedor.toLowerCase().includes(term)
        || usuario.descPerfil.toLowerCase().includes(term)
        || usuario.fechaCreacion.includes(term)
        ;
    });
  }

  searchDate(date: any, pipe: PipeTransform): UsuarioListComp[] {
    return this.usuarios.filter(usuario => {
      // const term = text.toLowerCase();
      // debugger;
      const dateParts = usuario.fechaCreacion.split('-');
      const dateObject = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
      const filterDate = new Date(`${date.month}/${date.day}/${date.year}`);
      // const filterDate = new Date('01/01/2019');
      // const formDate = new Date(usuario.fechaCreacion);
      console.log(date, 'date');
      console.log(filterDate, 'fecha control');
      console.log(dateObject, 'fecha form');
      console.log(usuario.fechaCreacion, 'formato natural');
      return dateObject > filterDate
        ;
    });
  }
}
