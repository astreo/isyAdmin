import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormObject } from '../../users/user/user.component';
import { FormType } from '../../../models/enum';
import { ZonaPeligrosa } from 'src/app/models/zonas-peligrosas.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZonasPeligrosasService } from '../../../services/zonas-peligrosas.service';
import { startWith, map } from 'rxjs/operators';
import { DangerZoneComponent } from '../danger-zone/danger-zone.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-danger-zones-list',
  templateUrl: './danger-zones-list.component.html',
  styleUrls: ['./danger-zones-list.component.scss']
})
export class DangerZonesListComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  // formObject: FormObject;
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  zones = {} as ZonaPeligrosa[];
  zones$: Observable<ZonaPeligrosa[]>;

  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public confirmationDialogService: ConfirmationDialogService, public modalService: NgbModal,
    private zonasPeligrosasService: ZonasPeligrosasService) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getList() {
    this.loading = true;
    this.subscription = this.zonasPeligrosasService.getZonas()
      .subscribe(result => {
        this.loading = false;
        this.zones = result;
        this.zones$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );
      });
  }


    openModal(formType: FormType, item?: ZonaPeligrosa) {
      debugger;
      if (!item) {
        item = {} as ZonaPeligrosa;
      }
      // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
      const modalRef = this.modalService.open(DangerZoneComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.zona = item;
      modalRef.componentInstance.formType = formType;
      modalRef.result.then((result: ZonaPeligrosa) => {
        if (result) {
          console.log('item: ', result);
          debugger;
          // tslint:disable-next-line: no-shadowed-variable
          let action: Observable<any>;
          let actionResult: string;
          // debugger;
          if (formType === FormType.NEW) {
            actionResult = 'agregado';
            action = this.zonasPeligrosasService.addPunto(result);
          } else {
            actionResult = 'actualizado';
            action = this.zonasPeligrosasService.updateZona(result);
          }
          action.subscribe(
            response => {
              Swal.fire({
                title: `${this.utilService.textToTitleCase(actionResult)}!`,
                text: `El punto ha sido ${actionResult} con éxito`,
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

    openConfirmationDialog(item: ZonaPeligrosa) {
      this.confirmationDialogService.confirm('Confirmación requerida',
        `Eliminar la zona "${item.nombre}"?`)
        .then((result) => {
          if (result) {
            if (item) {
              /* this.zonasPeligrosasService.deletePunto(item.idPuntoInteres).subscribe(
                response => {
                  Swal.fire({
                    title: `Eliminado!`,
                    text: `El punto ha sido eliminado con éxito`,
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
                }); */
            }
          }
        });
     }
  searchText(text: string): ZonaPeligrosa[] {
    return this.zones.filter(zones => {
      const term = text.toLowerCase();
      return zones.nombre.toLowerCase().includes(term)
        || zones.mensaje.toLowerCase().includes(term)
        || zones.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

}
