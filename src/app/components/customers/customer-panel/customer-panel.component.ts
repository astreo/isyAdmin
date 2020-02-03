import { Panel } from './../../../models/paneles.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersonaPanel } from '../../../models/relaciones.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PanelsDialogComponent } from '../../../shared/panels-dialog/panels-dialog.component';


declare class MyFormDataStructure {
  fields: {
    customerId: string;
    alias: string;
  };
  controls: {
    customerId: AbstractControl;
    alias: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  styleUrls: ['./customer-panel.component.scss']
})
export class CustomerPanelComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();

  @Input() formType: FormType;
  @Input() public personaPanel: PersonaPanel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, public modalService: NgbModal) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewPanel';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditPanel';
        break;
      default:
        break;
    }
    debugger;
    this.form = this.formBuilder.group({
      customerId: [this.personaPanel.panel.customerId, Validators.required],
      alias: [this.personaPanel.alias, Validators.required],

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

    const modalRef = this.modalService.open(PanelsDialogComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result: Panel) => {
      if (result) {
        this.ctrls.customerId.setValue(result.customerId);
        Object.assign(this.personaPanel.panel, result);
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
    this.personaPanel.alias = this.ctrls.alias.value;
    this.passEntry.emit(this.personaPanel);
    this.activeModal.close(this.personaPanel);
  }

}
