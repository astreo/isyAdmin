import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormObject } from '../../users/user/user.component';
import { FormType } from '../../../models/enum';
import { Observable, Subscription } from 'rxjs';
import { Panel } from 'src/app/models/paneles.model';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PanelesService } from '../../../services/paneles.service';
import { startWith, map } from 'rxjs/operators';
import { PanelComponent } from '../panel/panel.component';

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
  panels = {} as Panel[];
  panels$: Observable<Panel[]>;

  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public confirmationDialogService: ConfirmationDialogService, public modalService: NgbModal,
    private panelesService: PanelesService) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  openModal(formType: FormType, item?: Panel) {
    if (!item) {
      item = {} as Panel;
    }
    // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(PanelComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.panel = item;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: Panel) => {
      /* if (result) {
        console.log('item: ', result);
        debugger;
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        // debugger;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.panelesService.addPunto(result);
        } else {
          actionResult = 'actualizado';
          action = this.panelesService.updateZona(result);
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
      } */
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
