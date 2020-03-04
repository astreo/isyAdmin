import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Peticion } from 'src/app/models/peticion.model';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeticionesService } from '../../../services/peticiones.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { startWith, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ServicesDetailComponent } from '../services-detail/services-detail.component';




@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit, OnDestroy {
  loading: boolean;
  loadingCustData$: Observable<boolean>;
  list = {} as Peticion[];
  list$: Observable<Peticion[]>;

  loaded$ = this.store.select(state => state.clientes.loaded);

  loadedSubsctiption = new Subscription();
  subscription = new Subscription();
  intervalSubscription = new Subscription();
  actionSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public modalService: NgbModal,
    private peticionesService: PeticionesService, public store: Store<AppState>, private translateService: TranslateService) { }

  ngOnInit() {
    /*const source = interval(10000);
    const text = 'Your Text Here';
    this.subscription = source.subscribe(val => this.opensnack(text));*/

    this.getList(true);
    setInterval(() => {
      this.subscription.unsubscribe();
      this.getList(false);
    }, 10000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.intervalSubscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  getList(first: boolean) {
    console.log('getList', first);
    if (first) { this.loading = true; }
    this.subscription = this.peticionesService.getPeticiones()
      .subscribe((result = {} as Peticion[]) => {
        if (first) { this.loading = false; }
        // this.list = result;
        this.list = result.map((obj) => {
          switch (obj.servicio) {
            case 'BOM':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.FireDept');
              break;
            case 'AMBU':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.Ambulance');
              break;
            case 'ESC':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.Patrol');
              break;
            case 'EMEper':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.PersonalEmergency');
              break;
            case 'ACO':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.BatteryCharge');
              break;
            case 'REM':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.TowTruck');
              break;
            case 'CANEU':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.TireChange');
              break;
            case 'CERR':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.HomeLocks');
              break;
            case 'ELEC':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.Electrician');
              break;
            case 'PLOM':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.Plumbing');
              break;
            case 'CERRA':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.Carlock');
              break;
            case 'RECOM':
              obj.servicioDesc = this.translateService.instant('PAGES.Services.GasTankFillUp');
              break;
            default:
              break;
          }
          return obj;
        });
        // debugger;

        /*this.list$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );*/
      });
  }


  openModal(item: Peticion) {
    this.subscription.unsubscribe();
    const modalRef = this.modalService.open(ServicesDetailComponent, { size: 'lg', backdrop: 'static' });
    // const modalRef = this.modalService.open(ServicesDetailComponent);
    modalRef.componentInstance.idSolicitudServicio = item.idSolicitudServicio;
    modalRef.componentInstance.servicio = item.servicio;
  }

  openConfirmationDialog(item: Peticion) {
    /*
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar la zona "${item.nombre}"?`)
      .then((result) => {
        if (result) {
          if (item) {
            this.PeticionesService.deleteZona(item.idGeocerca).subscribe(
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

  /*searchText(text: string): Peticion[] {
    return this.list.map((obj) => {
      obj.tipoComunicador = obj.tipoComunicador ? obj.tipoComunicador : '';
      return obj;
    }).filter(list => {
      const term = text.toLowerCase();
      return list.customerId.toLowerCase().includes(term)
        || list.tipoComunicador.toLowerCase().includes(term)
        || list.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }*/

  searchText(text: string): Peticion[] {
    // debugger;
    return this.list.filter(list => {
      const term = text.toLowerCase();
      return list.idSolicitudServicio.toString().includes(term)
        || list.fechaCreacion.toLowerCase().includes(term)
        || list.persona.nombres.toLowerCase().includes(term)
        || list.persona.apellidos.toLowerCase().includes(term)
        || list.servicioDesc.toLowerCase().includes(term)
        ;
    });
  }

}
