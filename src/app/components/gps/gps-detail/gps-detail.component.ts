import { Gps } from './../../../models/gps.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Cliente } from '../../../models/cliente.model';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersDialogComponent } from '../../../shared/customers-dialog/customers-dialog.component';


// Formulario Principal
declare class MyFormDataStructure {
  fields: Gps;
  controls: {
    idGps: AbstractControl;
    patente: AbstractControl;
    latitud: AbstractControl;
    longitud: AbstractControl;
    fechaUltimaPosicion: AbstractControl;
    fechaCreacion: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

// Formulario de Datos de Cliente
declare class CustomerFormDataStructure {
  fields: Cliente;
  controls: {
    idPersona: AbstractControl;
    nombres: AbstractControl;
    apellidos: AbstractControl;
    nroDocumento: AbstractControl;
    telefono: AbstractControl;
  };
}

declare interface CustomerForm extends FormGroup {
  value: CustomerFormDataStructure['fields'];
  controls: CustomerFormDataStructure['controls'];
}


@Component({
  selector: 'app-gps-detail',
  templateUrl: './gps-detail.component.html',
  styleUrls: ['./gps-detail.component.scss']
})
export class GpsDetailComponent implements OnInit {
  formTitle: string;
  FormType = FormType;

  initialLat: number; // = 51.678418;
  initialLng: number; // = 7.809007;
  lat: number; // = 51.678418;
  lng: number; // = 7.809007;

  @Input() formType: FormType;
  @Input() public gps: Gps;
  @Input() public cliente: Cliente;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;
  customerForm: CustomerForm;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, public modalService: NgbModal) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewGps';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditGps';
        break;
      default:
        break;
    }

    this.form = this.formBuilder.group({
      idGps: this.gps.idGps,
      patente:  [this.gps.patente, Validators.required],
      fechaUltimaPosicion: this.gps.fechaUltimaPosicion,
      fechaCreacion: this.gps.fechaCreacion,
      latitud: this.gps.latitud,
      longitud: this.gps.longitud,
    }) as MyForm;

    this.customerForm = this.formBuilder.group({
      idPersona: [this.cliente.idPersona],
      nombres: [this.cliente.nombres],
      apellidos: [this.cliente.apellidos],
      nroDocumento: [this.cliente.nroDocumento],
      telefono: [this.cliente.telefono]
    }) as CustomerForm;

    // debugger;

    if (this.gps.latitud && this.gps.longitud) {
      this.setCurrentPos();
    } else {
      this.getCurrentPos();
    }
  }

  get ctrls() {
    return this.form.controls;
  }

  get custCtrls() {
    return this.customerForm.controls;
  }

  isInvalid(ctrl: AbstractControl) {
    return (ctrl.touched && ctrl.invalid);
  }

  getErrorMessage(fc: FormControl) {
    let resp = '';
    resp += fc.hasError('required') ? 'Debe ingresar un valor. ' : '';
    resp += fc.hasError('minlength') ? 'Debe ingresar mínimo 6 dígitos. ' : '';
    resp += fc.hasError('equalValidator') ? 'Los valores no coinciden ' : '';
    return resp;
  }

  setCurrentPos() {
    this.initialLat = this.gps.latitud;
    this.initialLng = this.gps.longitud;
    // this.lat = this.panel.latitud;
    // this.lng = this.panel.longitud;
  }

  getCurrentPos() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.initialLat = position.coords.latitude;
          this.initialLng = position.coords.longitude;
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permiso denegado');
              break;
            case 2:
              console.log('Posición no disponible');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    }
  }

  agregarMarcador(coords) {
    console.log(coords);
    // const coords: { lat: number, lng: number } = rawCoords;
    // this.lat = coords.lat;
    // this.lng = coords.lng;
    this.ctrls.latitud.setValue(coords.lat);
    this.ctrls.longitud.setValue(coords.lng);
  }

  openModal() {

    const modalRef = this.modalService.open(CustomersDialogComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result: Cliente) => {
      if (result) {
        // Object.assign(this.customerForm.setValue, result);
        this.customerForm.setValue(result);
        // this.custCtrls.idPersona.setValue(result.idPersona);
        // this.custCtrls.nombres.setValue(result.nombres);
        console.log('item: ', result);
      }
    });
  }

  ok() {
    this.gps = this.form.value;
    this.gps.idPersona = this.custCtrls.idPersona.value;
    // this.panel.latitud = this.lat;
    // this.panel.longitud = this.lng;
    debugger;
    this.passEntry.emit(this.gps);
    this.activeModal.close(this.gps);
  }

}
