import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PuntoDeInteres } from 'src/app/models/puntos-de-interes';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { SelectionModel } from 'src/app/models/misc.model';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare class MyFormDataStructure {
  fields: PuntoDeInteres;
  controls: {
    // fechaCreacion: AbstractControl;
    idPuntoInteres: AbstractControl;
    latitud: AbstractControl;
    longitud: AbstractControl;
    telefono: AbstractControl;
    tipo: AbstractControl;
    descripcion: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-points',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();

  initialLat: number; // = 51.678418;
  initialLng: number; // = 7.809007;
  lat: number; // = 51.678418;
  lng: number; // = 7.809007;

  tipos: SelectionModel[] = [
    {
      id: 'BOM',
      descripcion: 'BOMBEROS'
    },
    {
      id: 'COM',
      descripcion: 'COMISARIA'
    },
    {
      id: 'HOS',
      descripcion: 'HOSPITAL'
    },
    {
      id: 'BAS',
      descripcion: 'BASE'
    }
  ];

  @Input() formType: FormType;
  @Input() public punto: PuntoDeInteres;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewPointOfInterest';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditPointOfInterest';
        break;
      default:
        break;
    }

    this.form = this.formBuilder.group({
      tipo: [this.punto.tipo, Validators.required],
      telefono: [this.punto.telefono, Validators.required],
      descripcion: [this.punto.descripcion, Validators.required],
    }) as MyForm;

    this.getCurrentPos();
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
    resp += fc.hasError('equalValidator') ? 'Los valores no coinciden ' : '';
    return resp;
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
    this.lat = coords.lat;
    this.lng = coords.lng;
  }

  ok() {
    this.punto = this.form.value;
    this.punto.latitud = this.lat;
    this.punto.longitud = this.lng;
    // debugger;
    this.passEntry.emit(this.punto);
    this.activeModal.close(this.punto);
  }

}
