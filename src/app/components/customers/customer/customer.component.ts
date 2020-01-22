import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { AbstractControl, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  formTitle: string;
  FormType = FormType;

  @Input() formType: FormType;
  @Input() public cliente: Cliente;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  customerForm: CustomerForm;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, public modalService: NgbModal) { }

  ngOnInit() {
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewCustomer';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditCustomer';
        break;
      default:
        break;
    }

    this.customerForm = this.formBuilder.group({
      idPersona: [this.cliente.idPersona],
      nombres: [this.cliente.nombres],
      apellidos: [this.cliente.apellidos],
      nroDocumento: [this.cliente.nroDocumento],
      telefono: [this.cliente.telefono]
    }) as CustomerForm;
    this.customerForm.disable();
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

  openModal() {

    /*const modalRef = this.modalService.open(CustomersDialogComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result: Cliente) => {
      if (result) {
        // Object.assign(this.customerForm.setValue, result);
        this.customerForm.setValue(result);
        // this.custCtrls.idPersona.setValue(result.idPersona);
        // this.custCtrls.nombres.setValue(result.nombres);
        console.log('item: ', result);
      }
    });*/
  }

  ok() {
    /* this.gps = this.form.value;
    this.gps.idPersona = this.custCtrls.idPersona.value;

    debugger;
    this.passEntry.emit(this.gps);
    this.activeModal.close(this.gps); */
  }

}
