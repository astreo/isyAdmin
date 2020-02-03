import { Gps } from './../../../models/gps.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { Subscription } from 'rxjs';
import { PersonaGps } from '../../../models/relaciones.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GpsDialogComponent } from '../../../shared/gps-dialog/gps-dialog.component';

declare class MyFormDataStructure {
  fields: {
    patente: string;
    alias: string;
  };
  controls: {
    patente: AbstractControl;
    alias: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-customer-gps',
  templateUrl: './customer-gps.component.html',
  styleUrls: ['./customer-gps.component.scss']
})
export class CustomerGpsComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();

  @Input() formType: FormType;
  @Input() public personaGps: PersonaGps;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

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
    debugger;
    this.form = this.formBuilder.group({
      patente: [this.personaGps.gps.patente, Validators.required],
      alias: [this.personaGps.alias, Validators.required],

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

  openModal() {

    const modalRef = this.modalService.open(GpsDialogComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result: Gps) => {
      if (result) {
        this.ctrls.patente.setValue(result.patente);
        Object.assign(this.personaGps.gps, result);
        // this.customerForm.setValue(result);
        // this.custCtrls.idPersona.setValue(result.idPersona);
        // this.custCtrls.nombres.setValue(result.nombres);
        console.log('item: ', result);
      }
    });
  }


  ok() {
    debugger;
    // Object.assign(this.personaPanel, this.form.value);
    /*this.punto = this.form.value;
    this.punto.latitud = this.lat;
    this.punto.longitud = this.lng;*/
    this.personaGps.alias = this.ctrls.alias.value;
    this.passEntry.emit(this.personaGps);
    this.activeModal.close(this.personaGps);
  }

}
