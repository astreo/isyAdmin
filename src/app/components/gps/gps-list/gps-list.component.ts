import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormObject } from '../../users/user/user.component';
import { FormType } from '../../../models/enum';
import { Observable, Subscription } from 'rxjs';
import { Gps } from '../../../models/gps.model';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState } from '../../../store/app.reducer';
import { GpsService } from '../../../services/gps.service';
import { startWith, map } from 'rxjs/operators';
import { Cliente } from '../../../models/cliente.model';
import { clientes as actions } from '../../../store/actions';
import { GpsDetailComponent } from '../gps-detail/gps-detail.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gps-list',
  templateUrl: './gps-list.component.html',
  styleUrls: ['./gps-list.component.scss']
})
export class GpsListComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  // formObject: FormObject;
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  loadingCustData$: Observable<boolean>;
  gpsList = {} as Gps[];
  gpsList$: Observable<Gps[]>;

  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  subscription = new Subscription();
  actionSubscription = new Subscription();
  getClientesFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public modalService: NgbModal,
    private gpsService: GpsService, public store: Store<AppState>) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.getClientesFromStoreSubscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  getList() {
    this.loading = true;
    this.subscription = this.gpsService.getGpsList()
      .subscribe(result => {
        this.loading = false;
        this.gpsList = result;
        this.gpsList$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );
      });
  }

  getClienteFromStore2(idPersona: number) {
    this.getClientesFromStoreSubscription = this.store.select(state => state.clientes.clientes).subscribe(items => {
      items.filter(item => item.idPersona === idPersona).map(item => (
        item
      ));
    });
  }

  getClienteFromStore(idPersona: number) {
    let cliente: Cliente;
    return this.store.select(state => state.clientes.clientes).pipe(
      map(items => {
        (items.filter(item => item.idPersona === idPersona))
          .map(item => (
            cliente = item
          ));
        return cliente;
      }));
  }

  openModal(formType: FormType, item?: Gps) { // ver que cuando sea new pasar cliente vacio
    this.loadingCustData$ = this.store.select(state => state.clientes.loading);
    this.loadedSubsctiption = this.loaded$.subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(new actions.CargarClientes());
      } else {
        let cliente = {} as Cliente;
        if (!item) {
          item = {} as Gps;
          this.loadDialog(item, cliente, formType);
        } else {
          if (item.idPersona) {
            this.getClientesFromStoreSubscription = this.getClienteFromStore(item.idPersona).subscribe(
              resp => {
                if (resp) {
                  cliente = resp;
                  this.loadDialog(item, cliente, formType);
                }
              }
            );
          } else {
            this.loadDialog(item, cliente, formType);
          }
        }
      }
    });
  }

  loadDialog(item: Gps, cliente: Cliente, formType: FormType) {
    const modalRef = this.modalService.open(GpsDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.gps = item;
    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: Gps) => {
      if (result) {
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        // debugger;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.gpsService.addGps(result);
        } else {
          actionResult = 'actualizado';
          action = this.gpsService.updateGps(result);
        }
        this.actionSubscription = action.subscribe(
          response => {
            Swal.fire({
              title: `${this.utilService.textToTitleCase(actionResult)}!`,
              text: `El panel ha sido ${actionResult} con éxito`,
              type: 'success',
              confirmButtonText: 'OK'
            });
            // debugger;
            Object.assign(item, result);
            if (formType === FormType.NEW) {
              this.getList();
            }
          }
          ,
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              type: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    });
  }


  searchText(text: string): Gps[] {
    return this.gpsList.map((obj) => {
      obj.fechaUltimaPosicion = obj.fechaUltimaPosicion ? obj.fechaUltimaPosicion : '';
      return obj;
    }).filter(gpsList => {
      const term = text.toLowerCase();
      return gpsList.patente.toLowerCase().includes(term)
        || gpsList.fechaUltimaPosicion.toLowerCase().includes(term)
        || gpsList.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

}
