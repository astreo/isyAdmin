import { Gps } from './../../../models/gps.model';
import { Panel } from './../../../models/paneles.model';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Cliente, Titular, Dependiente, Dispositivo, CodigoVerificacion, SolicitudCliente } from '../../../models/cliente.model';
import { AbstractControl, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { NgbActiveModal, NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import Swal from 'sweetalert2';
import { PersonaProveedor, PersonaPanel, PersonaGps, PersonaCamara } from '../../../models/relaciones.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { clientes as actions } from '../../../store/actions';
import { CustomersDialogComponent } from '../../../shared/customers-dialog/customers-dialog.component';
import { SelectionModel } from '../../../models/misc.model';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { CustomerPanelComponent } from '../customer-panel/customer-panel.component';
import { UtilService } from '../../../services/util.service';
import { CustomerGpsComponent } from '../customer-gps/customer-gps.component';
import { CustomerPanelEventsComponent } from '../customer-panel-events/customer-panel-events.component';

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

declare class CustRequestFormDataStructure {
  fields: {
    fechaSolicitud: string;
    nroDocumento: string;
    nombreTitular: string;
    estado: string;
    // esTitular: boolean
  };
  controls: {
    idSolicitudCliente: AbstractControl;
    nroDocumento: AbstractControl;
    nombreTitular: AbstractControl;
    estado: AbstractControl;
    // esTitular: AbstractControl
  };
}

declare interface CustRequestForm extends FormGroup {
  value: CustRequestFormDataStructure['fields'];
  controls: CustRequestFormDataStructure['controls'];
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
  custRequestForm: CustRequestForm;

  getTitularSubscription = new Subscription();
  getDependientesSubscription = new Subscription();
  getDispositivosSubscription = new Subscription();
  getCodigoVerificacionSubscription = new Subscription();
  getPersonaProveedorSubscription = new Subscription();
  getSolicitudClienteSubscription = new Subscription();
  getPersonaPanelesSubscription = new Subscription();
  getPersonaGpsSubscription = new Subscription();
  getPersonaCamaraSubscription = new Subscription();
  updateTitularSubscription = new Subscription();
  deletePersonaProveedorSubscription = new Subscription();
  personaPanelActionSubscription = new Subscription();
  personaGpsActionSubscription = new Subscription();

  titular = {} as Titular;
  codigoVerificacion = {} as CodigoVerificacion;
  dependientes = {} as Dependiente[];
  dispositivos = {} as Dispositivo[];
  personaProveedor = {} as PersonaProveedor;
  personaPaneles = {} as PersonaPanel[];
  personaGps = {} as PersonaGps[];
  personaCamaras = {} as PersonaCamara[];
  originalData = {} as any;
  solicitudCliente = {} as SolicitudCliente;

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

  constructor(public utilService: UtilService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    public modalService: NgbModal,
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
    this.getSolicitudCliente(this.cliente.idPersona);
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
    this.personaPanelActionSubscription.unsubscribe();
    this.getSolicitudClienteSubscription.unsubscribe();
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

  setCustRequestForm() {
    this.custRequestForm = this.formBuilder.group({
      fechaSolicitud: [this.solicitudCliente.fechaSolicitud],
      documentoTitular: [this.solicitudCliente.documentoTitular],
      nombreTitular: [this.solicitudCliente.nombreTitular],
      estado: [this.solicitudCliente.estado],
      // esTitular: [this.solicitudCliente.esTitular]
    }) as CustRequestForm;
    this.custRequestForm.disable();
  }

  get custCtrls() {
    return this.customerForm.controls;
  }

  get provCtrls() {
    return this.providerForm.controls;
  }

  get custReqCtrls() {
    return this.custRequestForm.controls;
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
          this.loading = false;
          if (result.length === 0) {
            /*Swal.fire({
              title: 'Error!',
              text: 'Dependientes no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
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
          this.loading = false;
          if (result.length === 0) {
            /*Swal.fire({
              title: 'Error!',
              text: 'Dispositivos no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
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

  getSolicitudCliente(idPersona: number) {
    this.loading = true;
    this.getPersonaProveedorSubscription = this.clientesService.getSolicitudCliente(idPersona)
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (!result || result.length === 0) {
            /*Swal.fire({
              title: 'Error!',
              text: 'Solicitud no encontrado para esta persona',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
          } else {
            this.solicitudCliente = result;
            this.setCustRequestForm();
            console.log(JSON.stringify(this.solicitudCliente));
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
          this.loading = false;
          if (result.length === 0) {
            /*Swal.fire({
              title: 'Error!',
              text: 'Paneles no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
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
          this.loading = false;
          if (result.length === 0) {
            /*Swal.fire({
              title: 'Error!',
              text: 'Gps no encontrados',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
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
            /*Swal.fire({
              title: 'Error!',
              text: 'Cámaras no encontradas',
              type: 'error',
              confirmButtonText: 'OK'
            });*/
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

  openConfirmationServiceDialog() {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el servicio del proveedor "${this.personaProveedor.proveedor.nombre}"?`)
      .then((result) => {
        if (result) {

          this.deletePersonaProveedorSubscription = this.clientesService.deletePersonaProveedor(this.personaProveedor)
            .subscribe(
              response => {
                Swal.fire({
                  title: `Eliminado!`,
                  text: `El servicio ha sido eliminado con éxito`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                this.activeModal.close();
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

  openConfirmationPanelDialog(personaPanel: PersonaPanel) {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el panel "${this.personaProveedor.proveedor.nombre}"?`)
      .then((result) => {
        if (result) {

          this.deletePersonaProveedorSubscription = this.clientesService.deletePersonaPanel(personaPanel.idPersonaPanel)
            .subscribe(
              response => {
                Swal.fire({
                  title: `Eliminado!`,
                  text: `El panel ha sido eliminado con éxito`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                this.activeModal.close();
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

  openConfirmationGpsDialog(personaGps: PersonaGps) {
    this.confirmationDialogService.confirm('Confirmación requerida',
      `Eliminar el GPS "${this.personaProveedor.proveedor.nombre}"?`)
      .then((result) => {
        if (result) {

          this.deletePersonaProveedorSubscription = this.clientesService.deletePersonaGps(personaGps.idPersonaGps)
            .subscribe(
              response => {
                Swal.fire({
                  title: `Eliminado!`,
                  text: `El GPS ha sido eliminado con éxito`,
                  type: 'success',
                  confirmButtonText: 'OK'
                });
                this.activeModal.close();
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
      case 'custReq':
        this.editSolicitudCliente();
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

  editSolicitudCliente() {
    if (this.inEdition) {
      this.custReqCtrls.estado.enable();
      Object.assign(this.originalData, this.solicitudCliente);
    } else {
      this.custReqCtrls.estado.disable();
      Object.assign(this.solicitudCliente, this.originalData);
      this.custReqCtrls.estado.setValue(this.solicitudCliente.estado);
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
      case 'custReq':
        this.saveSolicitudCliente();
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
    this.store.dispatch(new actions.ActualizarCliente(this.cliente));
    this.custCtrls.telefono.disable();
    // this.inEdition = false;
  }

  saveSolicitudCliente() {
    this.solicitudCliente.estado = this.custReqCtrls.estado.value;
    this.updateTitularSubscription = this.clientesService.updateSolicitudCliente(this.solicitudCliente).subscribe(
      response => {
        Swal.fire({
          title: `ACTUALIZADO!`,
          text: `La solicitud ha sido actualizada con éxito`,
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

  openModalTitularReq() {
    if (this.inEdition) {
      const modalRef = this.modalService.open(CustomersDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.result.then((result: Cliente) => {
        if (result) {
          this.solicitudCliente.documentoTitular = result.nroDocumento;
          this.solicitudCliente.nombreTitular = result.nombres + ' ' + result.apellidos;
          console.log(JSON.stringify(result));
        }
      });
    }
  }

  openPanelInfoModal(item: PersonaPanel) {
    // const modalRef = this.modalService.open(CustomerPanelEventsComponent, { size: 'lg', backdrop: 'static' });
    const modalRef = this.modalService.open(CustomerPanelEventsComponent);
    modalRef.componentInstance.idPersonaPanel = item.idPersonaPanel;
  }

  openPanelModal(formType: FormType, item?: PersonaPanel) {
    if (!item) {
      item = {} as PersonaPanel;
      item.idPersona = this.cliente.idPersona;
      item.panel = {} as Panel;
    }
    debugger;
    // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(CustomerPanelComponent, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.personaPanel = item;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: PersonaPanel) => {
      if (result) {
        console.log('item: ', result);
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.clientesService.addPersonaPanel(result);
          // problema al agregar por el TcpConnection
        } else {
          actionResult = 'actualizado';
          action = this.clientesService.updatePersonaPanel(result);
        }
        this.personaPanelActionSubscription = action.subscribe(
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
              // this.getList();
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

  openGpsModal(formType: FormType, item?: PersonaGps) {
    if (!item) {
      item = {} as PersonaGps;
      item.idPersona = this.cliente.idPersona;
      item.gps = {} as Gps;
    }
    debugger;
    // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(CustomerGpsComponent, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.personaGps = item;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: PersonaGps) => {
      if (result) {
        console.log('item: ', result);
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          action = this.clientesService.addPersonaGps(result);
          this.getPersonaGps(this.cliente.idPersona); // problema al agregar por el TcpConnection
        } else {
          actionResult = 'actualizado';
          action = this.clientesService.updatePersonaGps(result);
        }
        this.personaGpsActionSubscription = action.subscribe(
          response => {
            debugger;
            Swal.fire({
              title: `${this.utilService.textToTitleCase(actionResult)}!`,
              text: `El punto ha sido ${actionResult} con éxito`,
              type: 'success',
              confirmButtonText: 'OK'
            });
            debugger;
            Object.assign(item, result);
            if (formType === FormType.NEW) {
              // this.getList();
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

  ok() {
    /* this.gps = this.form.value;
    this.gps.idPersona = this.custCtrls.idPersona.value;

    debugger;
    this.passEntry.emit(this.gps);
    this.activeModal.close(this.gps); */
  }

  close() {
    this.activeModal.close();
  }

}
