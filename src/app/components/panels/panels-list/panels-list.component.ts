import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormObject } from '../../users/user/user.component';
import { FormType } from '../../../models/enum';
import { Observable, Subscription } from 'rxjs';
import { Panel } from 'src/app/models/paneles.model';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PanelesService } from '../../../services/paneles.service';
import { startWith, map, filter } from 'rxjs/operators';
import { PanelComponent } from '../panel/panel.component';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { clientes as actions } from '../../../store/actions';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-panels-list',
  templateUrl: './panels-list.component.html',
  styleUrls: ['./panels-list.component.scss']
})
export class PanelsListComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  // formObject: FormObject;
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  loadingCustData$: Observable<boolean>;
  panels = {} as Panel[];
  panels$: Observable<Panel[]>;

  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  subscription = new Subscription();
  actionSubscription = new Subscription();
  getClientesFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public modalService: NgbModal,
    private panelesService: PanelesService, public store: Store<AppState>) { }

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
    this.subscription = this.panelesService.getPaneles()
      .subscribe(result => {
        this.loading = false;
        this.panels = result;
        this.panels$ = this.textFilter.valueChanges.pipe(
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

  openModal(formType: FormType, item?: Panel) { // ver que cuando sea new pasar cliente vacio
    this.loadingCustData$ = this.store.select(state => state.clientes.loading);
    this.loadedSubsctiption = this.loaded$.subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(new actions.CargarClientes());
      } else {
        let cliente = {} as Cliente;
        if (!item) {
          item = {} as Panel;
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

  loadDialog(item: Panel, cliente: Cliente, formType: FormType) {
    const modalRef = this.modalService.open(PanelComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.panel = item;
    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: Panel) => {
      if (result) {
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        // debugger;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.panelesService.addPanel(result);
        } else {
          actionResult = 'actualizado';
          action = this.panelesService.updatePanel(result);
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

  openConfirmationDialog(item: Panel) {
    /*
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar la zona "${item.nombre}"?`)
      .then((result) => {
        if (result) {
          if (item) {
            this.panelesService.deleteZona(item.idGeocerca).subscribe(
              response => {
                Swal.fire({
                  title: `Eliminado!`,
                  text: `La zona ha sido eliminada con éxito`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                this.getList();
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
        }
      });
      */
  }

  searchText(text: string): Panel[] {
    return this.panels.map((obj) => {
      obj.tipoComunicador = obj.tipoComunicador ? obj.tipoComunicador : '';
      return obj;
    }).filter(panels => {
      const term = text.toLowerCase();
      return panels.customerId.toLowerCase().includes(term)
        || panels.tipoComunicador.toLowerCase().includes(term)
        || panels.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

}
