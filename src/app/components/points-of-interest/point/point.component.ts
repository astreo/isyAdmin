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

  ok() {
    this.punto = this.form.value;
    // debugger;
    this.passEntry.emit(this.punto);
    this.activeModal.close(this.punto);
  }

}
