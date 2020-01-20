import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Observable, Subscription } from 'rxjs';
import { Cliente } from '../../../models/cliente.model';
import { FormControl } from '@angular/forms';
import { AppState } from '../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { clientes as actions } from '../../../store/actions';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {
  FormType = FormType;
  formType: FormType;
  loading$: Observable<boolean>;
  clientes = {} as Cliente[];
  clientes$: Observable<Cliente[]>;
  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  accountSubscription = new Subscription();
  getClientesFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public store: Store<AppState>, public modalService: NgbModal,
    public confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.clientes.loading);
    this.loadedSubsctiption = this.loaded$.subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(new actions.CargarClientes());
      } else {
        this.getClientesFromStore();

      }
    });
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
    this.getClientesFromStoreSubscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
  }


  getClientesFromStore() {
    this.getClientesFromStoreSubscription = this.store.select(state => state.clientes.clientes)
      .subscribe(items => {
        this.clientes = items;
        this.clientes$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );
      });
  }


  /*openModal(formObject: FormObject, formType: FormType, customer?: Cliente) {
    if (!customer) {
      customer = {} as Cliente;
    }
    const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(UserComponent, { size: size, backdrop: 'static' });
    modalRef.componentInstance.customer = customer;
    modalRef.componentInstance.formObject = formObject;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: UsuarioListComp) => {
      if (result) {
        // console.log('Modelo: ' + JSON.stringify(result));
        if (customer.idUsuario) {
          // customer = Object.assign(customer, result);
          this.store.dispatch(new actions.ActualizarUsuario(Object.assign(customer, result)));
        } else {
          this.store.dispatch(new actions.AgregarUsuario(result));
        }
      }
    });
  }*/

  openConfirmationDialog(customer: Cliente) {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el cliente "${customer.idPersona}" de ${customer.nombres} ${customer.apellidos}?`)
      .then((result) => {
        if (result) {
          if (customer) {
            // customer = Object.assign(customer, result);
            // debugger;
            // this.store.dispatch(new actions.EliminarUsuario(customer.idPersona));
          }
        }
      });
    // .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  searchText(text: string): Cliente[] {
    return this.clientes.map((obj) => {
      obj.apellidos = obj.apellidos ? obj.apellidos : '';
      obj.nroDocumento = obj.nroDocumento ? obj.nroDocumento : '';
      return obj;
    }).filter(clientes => {
      const term = text.toLowerCase();
      return (clientes.nombres.trim() + ' ' + clientes.apellidos.trim()).toLowerCase().includes(term)
        // || clientes.apellidos.toLowerCase().includes(term)
        || clientes.nroDocumento.toLowerCase().includes(term)
        || clientes.telefono.toLowerCase().includes(term)
        ;
    });
  }

}
