import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { FormObject } from '../../users/user/user.component';
import { FormType } from '../../../models/enum';
import { PuntoDeInteres } from '../../../models/puntos-de-interes';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { PuntosDeInteresService } from '../../../services/puntos-de-interes.service';
import { map, startWith, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PointComponent } from '../point/point.component';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-points-list',
  templateUrl: './points-list.component.html',
  styleUrls: ['./points-list.component.scss']
})
export class PointsListComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  // formObject: FormObject;
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  points = {} as PuntoDeInteres[];
  points$: Observable<PuntoDeInteres[]>;

  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public confirmationDialogService: ConfirmationDialogService, public modalService: NgbModal,
    private puntosDeInteresService: PuntosDeInteresService) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getList() {
    this.loading = true;
    this.subscription = this.puntosDeInteresService.getPuntos(8).subscribe(result => {
      this.loading = false;
      this.points = result;
      this.points$ = this.textFilter.valueChanges.pipe(
        startWith(''),
        map(text => this.searchText(text))
      );
    });
  }

  openModal(formType: FormType, item?: PuntoDeInteres) {
    // debugger;
    if (!item) {
      item = {} as PuntoDeInteres;
    }
    // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(PointComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.punto = item;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: PuntoDeInteres) => {
      if (result) {
        console.log('item: ', result);
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        debugger;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.puntosDeInteresService.addPunto(result);
        } else {
          actionResult = 'actualizado';
          action = this.puntosDeInteresService.updatePunto(item.idPuntoInteres, result);
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

  openConfirmationDialog(item: PuntoDeInteres) {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el punto "${item.descripcion}"?`)
      .then((result) => {
        if (result) {
          if (item) {
            this.puntosDeInteresService.deletePunto(item.idPuntoInteres).subscribe(
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
              });
          }
        }
      });
    // .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  searchText(text: string): PuntoDeInteres[] {
    return this.points.filter(points => {
      const term = text.toLowerCase();
      return points.telefono.toLowerCase().includes(term)
        || points.descripcion.toLowerCase().includes(term)
        || points.tipo.toLowerCase().includes(term)
        || points.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

}
