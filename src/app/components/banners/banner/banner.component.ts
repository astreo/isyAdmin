import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Banner } from '../../../models/banner.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { Subscription, Observable } from 'rxjs';
import { NgbActiveModal, NgbDate, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../services/util.service';
import Swal from 'sweetalert2';
import { RangeDatesDialogComponent } from '../../../shared/range-dates-dialog/range-dates-dialog.component';
import { SelectionModel } from '../../../models/misc.model';


declare class MyFormDataStructure {
  fields: Banner;
  controls: {
    // fechaCreacion: AbstractControl;
    idBanner: AbstractControl;
    contenidoAnuncio: AbstractControl;
    linkAnuncio: AbstractControl;
    pathImagen: AbstractControl;
    rangoFechas: AbstractControl;
    prioridad: AbstractControl;
    enviarNoCliente: AbstractControl;
    enviarCliente: AbstractControl;
    plataforma: AbstractControl;
    orden: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();
  actionSubscription = new Subscription();

  prioridades: SelectionModel[] = [
    {
      id: 1,
      descripcion: 'ALTA'
    },
    {
      id: 2,
      descripcion: 'BAJA'
    }
  ];

  plataformas: SelectionModel[] = [
    {
      id: 'DROID',
      descripcion: 'ANDROID'
    },
    {
      id: 'IOS',
      descripcion: 'IOS'
    }
  ];

  @Input() formType: FormType;
  @Input() public banner: Banner;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  startDate = {} as any;

  constructor(public utilService: UtilService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    private calendar: NgbCalendar, public modalService: NgbModal
    ) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewBanner';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditBanner';
        break;
      default:
        break;
    }

    const fechas = this.banner.rangoFechas.split(' - ');

    // this.fromDate = this.calendar.getToday();
    this.fromDate = this.utilService.stringToNgbDate(fechas[0]);
    this.startDate.year = this.fromDate.year;
    this.startDate.month = this.fromDate.month;
    // this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.toDate = this.utilService.stringToNgbDate(fechas[1]);

    this.form = this.formBuilder.group({
      contenidoAnuncio: [this.banner.contenidoAnuncio, Validators.required],
      linkAnuncio: [this.banner.linkAnuncio, Validators.required],
      pathImagen: [this.banner.pathImagen, Validators.required],
      rangoFechas: [this.banner.rangoFechas, Validators.required],
      prioridad: [this.banner.prioridad, Validators.required],
      enviarNoCliente: [this.banner.enviarNoCliente, Validators.required],
      enviarCliente: [this.banner.enviarCliente, Validators.required],
      plataforma: [this.banner.plataforma, Validators.required],
      orden: [this.banner.orden, Validators.required],
    }) as MyForm;
    // debugger;
  }

  get ctrls() {
    return this.form.controls;
  }

  isInvalid(ctrl: AbstractControl) {
    return (ctrl.touched && ctrl.invalid);
  }

  getErrorMessage(fc: FormControl) {
    let resp = '';
    resp += fc.hasError('required') ? 'Debe ingresar un valor. ' : '';
    resp += fc.hasError('minlength') ? 'Debe ingresar mínimo 6 dígitos. ' : '';
    resp += fc.hasError('maxlength') ? 'Ha excedido la cantidad de caracteres. ' : '';
    resp += fc.hasError('equalValidator') ? 'Los valores no coinciden ' : '';
    return resp;
  }

  ok() {
    this.banner = this.form.value;
    /*this.noticia.latitud = this.lat;
    this.noticia.longitud = this.lng;*/

    this.passEntry.emit(this.banner);
    this.activeModal.close(this.banner);
  }

  uploadFile(event) {
    const reader = new FileReader(); // HTML5 FileReader API
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.ctrls.pathImagen.setValue(reader.result);
        /*this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;*/
      };
      // ChangeDetectorRef since file is loading outside the zone
      // this.cd.markForCheck();
    }
  }

  openRangeDatesModal() {
    // debugger;
    const modalRef = this.modalService.open(RangeDatesDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rangoFechas = this.ctrls.rangoFechas.value;
    modalRef.result.then((result: Banner) => {
      if (result) {
        // debugger;
        console.log('item: ', result);
        this.ctrls.rangoFechas.setValue(result);
        debugger;
        console.log('ctrl: ', this.ctrls.rangoFechas.value);

      }
    });
  }
}
