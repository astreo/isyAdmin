import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioListComp } from '../../../models/usuarios.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as actions from '../../../store/actions';
import { map } from 'rxjs/operators';
import { SelectionModel } from 'src/app/models/misc.model';
import { Subscription, Observable } from 'rxjs';
import { equalValidator } from 'src/app/validators/equal.validator';
import { FormType } from '../../../models/enum';

declare class MyFormDataStructure {
  fields: UsuarioListComp;
  controls: {
    // fechaCreacion: AbstractControl;
    nombres: AbstractControl;
    apellidos: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    confirmPassword: AbstractControl;
    email: AbstractControl;
    telefono: AbstractControl;
    // estado: AbstractControl;
    idProveedor: AbstractControl;
    descProveedor: AbstractControl;
    idPerfil: AbstractControl;
    descPerfil: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

export enum FormObject {
  USER,
  PASSWORD
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  FormObject = FormObject;
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  hideField: boolean;

  perfiles$: Observable<SelectionModel[]>;
  proveedores$: Observable<SelectionModel[]>;

  accountSubscription = new Subscription();
  perfilesLoadedSubscription = new Subscription();
  proveedoresLoadedSubscription = new Subscription();

  perfilesLoaded$ = this.store.select(state => state.perfil.loaded);
  proveedoresLoaded$ = this.store.select(state => state.proveedor.loaded);
  idProveedor: number;

  @Input() formObject: FormObject;
  @Input() formType: FormType;
  @Input() public user: UsuarioListComp;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

  constructor(
    public store: Store<AppState>, public activeModal: NgbActiveModal, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // debugger;
    // this.formObject = this.data.formType;
    // this.recipe = <Recipe>{};
    if (this.formObject === FormObject.USER) {
      this.hideField = false;
      switch (this.formType) {
        case FormType.NEW:
          this.formTitle = 'PAGES.ModalTitles.NewUser';
          break;
        case FormType.EDIT:
          this.formTitle = 'PAGES.ModalTitles.EditUser';
          break;
        default:
          break;
      }
    } else {
      this.formTitle = 'PAGES.ModalTitles.ResetPassword';
      this.hideField = true;
    }

    this.accountSubscription = this.store.select(state => state.account.usuario.proveedor.idProveedor)
      .subscribe(idProveedor => {
        this.idProveedor = idProveedor;
      });

    this.perfilesLoadedSubscription = this.perfilesLoaded$.subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(new actions.perfil.CargarPerfiles());
      } else {
        // this.store.select('account')
        while (!this.idProveedor) { }
        this.getPerfilesFromStore(this.idProveedor);
      }
    });

    this.proveedoresLoadedSubscription = this.proveedoresLoaded$.subscribe(loaded => {
      if (!loaded) {
        while (!this.idProveedor) { }
        this.store.dispatch(new actions.proveedor.CargarProveedores(this.idProveedor));
      } else {
        this.getProveedoresFromStore();
      }
    });

    this.form = this.formBuilder.group({

      nombres: [this.user.nombres, Validators.required],
      apellidos: [this.user.apellidos, Validators.required],
      username: [this.user.username, Validators.required],

      password: ['', equalValidator('password', 'confirmPassword')],
      confirmPassword: ['', equalValidator('password', 'confirmPassword')],

      email: [this.user.email, Validators.required],
      telefono: [this.user.telefono, Validators.required],
      idProveedor: [this.user.idProveedor, Validators.required],
      descProveedor: [this.user.descProveedor, Validators.required],
      idPerfil: [this.user.idPerfil, Validators.required],
      descPerfil: [this.user.descPerfil, Validators.required],
    }) as MyForm;
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
    this.perfilesLoadedSubscription.unsubscribe();
    this.proveedoresLoadedSubscription.unsubscribe();
  }

  get flds() {
    return this.form.value;
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

  getPerfilesFromStore(idProveedor: number) {
    this.perfiles$ = this.store.select(state => state.perfil.perfiles).pipe(
      map(item => {
        return (
          // tslint:disable-next-line: no-shadowed-variable
          item.filter(item => item.proveedor.find(a => a.idProveedor === idProveedor))
            // tslint:disable-next-line: no-shadowed-variable
            .map(item => ({
              id: item.idPerfil,
              descripcion: item.descripcion
            }))
        );
      }));
  }

  getProveedoresFromStore() {
    this.proveedores$ = this.store.select(state => state.proveedor.proveedores).pipe(
      map(item => {
        return (
          item
            // tslint:disable-next-line: no-shadowed-variable
            .map(item => ({
              id: item.idProveedor,
              descripcion: item.nombre
            }))
        );
      }));
  }

  onPerfilChange(event) {
    this.ctrls.descPerfil.setValue(event.target[event.target.selectedIndex].label);
    // debugger;
  }

  onProveedorChange(event) {
    this.ctrls.descProveedor.setValue(event.target[event.target.selectedIndex].label);
    // debugger;
  }

  ok() {
    this.user = this.form.value;
    // debugger;
    this.passEntry.emit(this.user);
    this.activeModal.close(this.user);
  }

}
