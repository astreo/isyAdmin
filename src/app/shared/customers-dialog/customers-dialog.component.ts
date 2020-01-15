import { Component, OnInit, Output, EventEmitter, OnDestroy, PipeTransform } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { FormControl } from '@angular/forms';
import { AppState } from 'src/app/store/app.reducer';
import { clientes as actions } from '../../store/actions';
import { Store } from '@ngrx/store';
import { DecimalPipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-customers-dialog',
  templateUrl: './customers-dialog.component.html',
  styleUrls: ['./customers-dialog.component.scss']
})
export class CustomersDialogComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  clientes = {} as Cliente[];
  clientes$: Observable<Cliente[]>;
  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  getClientesFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal, public store: Store<AppState>) { }

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

  doubleClick (item: Cliente) {
    console.log('cliente:', item);
    this.ok(item);
  }

  ok(item: Cliente) {

    this.passEntry.emit(item);
    this.activeModal.close(item);
  }

}
