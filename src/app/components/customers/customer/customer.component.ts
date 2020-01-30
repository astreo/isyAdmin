import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Cliente, Titular, Dependiente, Dispositivo, CodigoVerificacion } from '../../../models/cliente.model';
import { AbstractControl, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { NgbActiveModal, NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import Swal from 'sweetalert2';
import { PersonaProveedor, PersonaPanel, PersonaGps, PersonaCamara } from '../../../models/relaciones.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { clientes as actions } from '../../../store/actions';
import { CustomersDialogComponent } from '../../../shared/customers-dialog/customers-dialog.component';
import { SelectionModel } from '../../../models/misc.model';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';

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


declare class ProviderFormDataStructure {
  fields: PersonaProveedor;
  controls: {
    idPersonaProveedor: AbstractControl;
    fechaCreacion: AbstractControl;
    nroCuenta: AbstractControl;
    estadoServicio: AbstractControl;
    totalConnect: AbstractControl;
  };
}

declare interface ProviderForm extends FormGroup {
  value: ProviderFormDataStructure['fields'];
  controls: ProviderFormDataStructure['controls'];
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {

  formTitle: string;
  FormType = FormType;

  @Input() formType: FormType;
  @Input() public cliente: Cliente;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  customerForm: CustomerForm;
  providerForm: ProviderForm;

  getTitularSubscription = new Subscription();
  getDependientesSubscription = new Subscription();
  getDispositivosSubscription = new Subscription();
  getCodigoVerificacionSubscription = new Subscription();
  getPersonaProveedorSubscription = new Subscription();
  getPersonaPanelesSubscription = new Subscription();
  getPersonaGpsSubscription = new Subscription();
  getPersonaCamaraSubscription = new Subscription();
  updateTitularSubscription = new Subscription();
  deletePersonaProveedorSubscription = new Subscription();

  titular = {} as Titular;
  codigoVerificacion = {} as CodigoVerificacion;
  dependientes = {} as Dependiente[];
  dispositivos = {} as Dispositivo[];
  personaProveedor = {} as PersonaProveedor;
  personaPaneles = {} as PersonaPanel[];
  personaGps = {} as PersonaGps[];
  personaCamaras = {} as PersonaCamara[];
  originalData = {} as any;

  estadosServicio: SelectionModel[] = [
    {
      id: 'A',
      descripcion: 'Active'
    },
    {
      id: 'P',
      descripcion: 'Pending'
    },
    {
      id: 'I',
      descripcion: 'Inactive'
    }
  ];

  estadosTotalConnect: SelectionModel[] = [
    {
      id: true,
      descripcion: 'Active'
    },
    {
      id: false,
      descripcion: 'Inactive'
    }
  ];

  loading = false;

  inEdition = false;

  pageSize = 5;
  tab1Page = 1;
  tab2Page = 1;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, public modalService: NgbModal,
    public clientesService: ClientesService,
    public confirmationDialogService: ConfirmationDialogService,
    public store: Store<AppState>) { }

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

    this.getTitular(this.cliente.idPersona);
    this.getDependientes(this.cliente.idPersona);
    this.getDispositivos(this.cliente.idPersona);
    this.getCodigoVerificacion(this.cliente.idPersona);
    this.getPersonaProveedor(this.cliente.idPersona);
    this.getPersonaPaneles(this.cliente.idPersona);
    this.getPersonaGps(this.cliente.idPersona);
    this.getPersonaCamaras(this.cliente.idPersona);

    this.setCustomerForm();
  }

  ngOnDestroy() {
    this.getTitularSubscription.unsubscribe();
    this.getDependientesSubscription.unsubscribe();
    this.getDispositivosSubscription.unsubscribe();
    this.getCodigoVerificacionSubscription.unsubscribe();
    this.getPersonaProveedorSubscription.unsubscribe();
    this.getPersonaPanelesSubscription.unsubscribe();
    this.getPersonaGpsSubscription.unsubscribe();
    this.getPersonaCamaraSubscription.unsubscribe();
    this.deletePersonaProveedorSubscription.unsubscribe();
  }

  setCustomerForm() {
    this.customerForm = this.formBuilder.group({
      idPersona: [this.cliente.idPersona],
      nombres: [this.cliente.nombres],
      apellidos: [this.cliente.apellidos],
      nroDocumento: [this.cliente.nroDocumento],
      telefono: [this.cliente.telefono]
    }) as CustomerForm;
    this.customerForm.disable();
  }

  setProviderForm() {
    this.providerForm = this.formBuilder.group({
      idPersonaProveedor: [this.personaProveedor.idPersonaProveedor],
      fechaCreacion: [this.personaProveedor.fechaCreacion],
      nroCuenta: [this.personaProveedor.nroCuenta],
      estadoServicio: [this.personaProveedor.estadoServicio],
      totalConnect: [this.personaProveedor.totalConnect]
    }) as ProviderForm;
    this.providerForm.disable();
  }

  get custCtrls() {
    return this.customerForm.controls;
  }

  get provCtrls() {
    return this.providerForm.controls;
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

  getPersona(idPersona: number) {
    this.loading = true;
    this.getTitularSubscription = this.clientesService.getPersona(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Titular no encontrado',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            this.titular = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getTitular(idPersona: number) {
    this.loading = true;
    this.getTitularSubscription = this.clientesService.getTitular(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Titular no encontrado',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            this.titular = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getDependientes(idPersona: number) {
    this.loading = true;
    this.getDependientesSubscription = this.clientesService.getDependientes(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Dependientes no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.dependientes = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getDispositivos(idPersona: number) {
    this.loading = true;
    this.getDispositivosSubscription = this.clientesService.getDispositivos(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Dispositivos no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.dispositivos = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getCodigoVerificacion(idPersona: number) {
    this.loading = true;
    this.getCodigoVerificacionSubscription = this.clientesService.getCodigoVerificacion(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Codigo de verificación no encontrado',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.codigoVerificacion = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getPersonaProveedor(idPersona: number) {
    this.loading = true;
    this.getPersonaProveedorSubscription = this.clientesService.getPersonaProveedor(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Proveedor no encontrado para esta persona',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            this.personaProveedor = result;
            this.setProviderForm();
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getPersonaPaneles(idPersona: number) {
    this.loading = true;
    this.getPersonaPanelesSubscription = this.clientesService.getPersonaPaneles(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Paneles no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.personaPaneles = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getPersonaGps(idPersona: number) {
    this.loading = true;
    this.getPersonaGpsSubscription = this.clientesService.getPersonaGps(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Gps no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.personaGps = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  getPersonaCamaras(idPersona: number) {
    this.loading = true;
    this.getPersonaCamaraSubscription = this.clientesService.getPersonaCamaras(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Gps no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {

            this.personaCamaras = result;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if (this.inEdition) {
      $event.preventDefault();
      alert('No se puede acceder a otro panel mientras el actual está en edición');
    }
  }

  openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el servicio del proveedor "${this.personaProveedor.proveedor.nombre}"?`)
      .then((result) => {
        if (result) {

          this.deletePersonaProveedorSubscription = this.clientesService.deletePersonaProveedor(this.personaProveedor.idPersonaProveedor)
          .subscribe(
            response => {
              Swal.fire({
                title: `Eliminado!`,
                text: `El servicio ha sido eliminado con éxito`,
                type: 'success',
                confirmButtonText: 'OK'
              });
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

  edit(tab: string) {
    this.inEdition = !this.inEdition;
    // debugger;
    switch (tab) {
      case 'customer':
        this.editCliente();
        break;
      case 'holder':
        this.editTitular();
        break;
      case 'serviceProvider':
        this.editServiceProvider();
        break;
      default:
        break;
    }
  }

  editServiceProvider() {
    if (this.inEdition) {
      debugger;
      Object.assign(this.originalData, this.providerForm.value);
      this.providerForm.enable();
      this.provCtrls.fechaCreacion.disable();
    } else {
      debugger;
      // Object.assign(this.provCtrls, this.originalData);
      this.providerForm.setValue(this.originalData);
      this.providerForm.disable();
      // this..setValue(this.cliente.telefono);
    }
  }

  editCliente() {
    if (this.inEdition) {
      this.custCtrls.telefono.enable();
    } else {
      this.custCtrls.telefono.disable();
      this.custCtrls.telefono.setValue(this.cliente.telefono);
    }
  }

  editTitular() {
    if (this.inEdition) {
      this.openModal();
    } else {
      Object.assign(this.titular, this.originalData);
    }
  }

  save(tab: string) {
    this.inEdition = !this.inEdition;
    // debugger;
    switch (tab) {
      case 'customer':
        this.saveCliente();
        break;
      case 'holder':
        this.saveTitular();
        break;
      case 'serviceProvider':
        this.saveServiceProvider();
        break;
      default:
        break;
    }
  }

  saveCliente() {
    Object.assign(this.cliente, this.customerForm.value);
    this.store.dispatch(new actions.ActualizarUsuario(this.cliente));
    this.custCtrls.telefono.disable();
    // this.inEdition = false;
  }

  saveTitular() {
    this.updateTitularSubscription = this.clientesService.updateTitular(this.cliente.idPersona, this.titular.idPersona).subscribe(
      response => {
        Swal.fire({
          title: `ACTUALIZADO!`,
          text: `El titular ha sido actualizado con éxito`,
          type: 'success',
          confirmButtonText: 'OK'
        });
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

  saveServiceProvider() {
    Object.assign(this.personaProveedor, this.providerForm.value);
    this.updateTitularSubscription = this.clientesService.updatePersonaProveedor(this.personaProveedor).subscribe(
      response => {
        Swal.fire({
          title: `ACTUALIZADO!`,
          text: `El servicio ha sido actualizado con éxito`,
          type: 'success',
          confirmButtonText: 'OK'
        });
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

  openModal() {
    const modalRef = this.modalService.open(CustomersDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((result: Cliente) => {
      if (result) {
        Object.assign(this.originalData, this.titular);
        // Object.assign(this.titular, result);
        this.getPersona(result.idPersona);
        // this.customerForm.setValue(result);
      }
    });
  }

  ok() {
    /* this.gps = this.form.value;
    this.gps.idPersona = this.custCtrls.idPersona.value;

    debugger;
    this.passEntry.emit(this.gps);
    this.activeModal.close(this.gps); */
  }

}
