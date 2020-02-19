import { CustomerComponent } from './../customer/customer.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Observable, Subscription } from 'rxjs';
import { Cliente, ClienteVM } from '../../../models/cliente.model';
import { FormControl } from '@angular/forms';
import { AppState } from '../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { clientes as actions } from '../../../store/actions';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { startWith, map } from 'rxjs/operators';
import { CustomerAddComponent } from '../customer-add/customer-add.component';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  loading$: Observable<boolean>;
  clientes = {} as Cliente[];
  pendientes = {} as Cliente[];
  pendientes$: Observable<Cliente[]>;
  clientes$: Observable<Cliente[]>;
  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  accountSubscription = new Subscription();
  getClientesFromStoreSubscription = new Subscription();
  getPendientesSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  custTextFilter = new FormControl('');
  pendTextFilter = new FormControl('');

  constructor(public store: Store<AppState>, public modalService: NgbModal, public clientesService: ClientesService,
    public confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.getPendientes();
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
    this.getPendientesSubscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
  }


  getClientesFromStore() {
    this.getClientesFromStoreSubscription = this.store.select(state => state.clientes.clientes)
      .subscribe(items => {
        this.clientes = items;
        this.clientes$ = this.custTextFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchTextClientes(text))
        );
      });
  }

  getPendientes() {
    this.loading = true;
    this.getPendientesSubscription = this.clientesService.getPendientes()
      .subscribe(result => {
        this.loading = false;
        // debugger;
        this.pendientes = result;
        this.pendientes$ = this.pendTextFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchTextPendientes(text))
        );
      });
  }


  openModal(formType: FormType, customer?: Cliente) {
    if (!customer) {
      customer = {} as Cliente;
    }
    // debugger;
    const size = 'lg';
    const modalRef = this.modalService.open(CustomerComponent, { size: size, backdrop: 'static' });
    modalRef.componentInstance.cliente = customer;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: Cliente) => {
      if (result) {
        /*
        if (customer.idUsuario) {
          // customer = Object.assign(customer, result);
          this.store.dispatch(new actions.ActualizarUsuario(Object.assign(customer, result)));
        } else {
          this.store.dispatch(new actions.AgregarUsuario(result));
        }
        */
      }
    });
  }

  openAddModal(formType: FormType) {
    const size = 'sm';
    const modalRef = this.modalService.open(CustomerAddComponent, { size: size, backdrop: 'static' });
    // modalRef.componentInstance.cliente = customer;
    // modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: ClienteVM) => {
      if (result) {
        this.store.dispatch(new actions.AgregarCliente(result));
        /*
        if (customer.idUsuario) {
          // customer = Object.assign(customer, result);
          this.store.dispatch(new actions.ActualizarUsuario(Object.assign(customer, result)));
        } else {
          this.store.dispatch(new actions.AgregarUsuario(result));
        }
        */
      }
    });
  }

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

  searchTextClientes(text: string): Cliente[] {
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

  searchTextPendientes(text: string): Cliente[] {
    return this.pendientes.map((obj) => {
      obj.apellidos = obj.apellidos ? obj.apellidos : '';
      obj.nroDocumento = obj.nroDocumento ? obj.nroDocumento : '';
      return obj;
    }).filter(pendientes => {
      const term = text.toLowerCase();
      return (pendientes.nombres.trim() + ' ' + pendientes.apellidos.trim()).toLowerCase().includes(term)
        // || pendientes.apellidos.toLowerCase().includes(term)
        || pendientes.nroDocumento.toLowerCase().includes(term)
        || pendientes.telefono.toLowerCase().includes(term)
        ;
    });
  }

}
