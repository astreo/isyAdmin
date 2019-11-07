import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioListComp, UsuarioList } from '../../../models/usuarios.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as actions from '../../../store/actions';
import { map } from 'rxjs/operators';
import { SelectionModel } from 'src/app/models/misc.model';
import { Subscription, Observable } from 'rxjs';

declare class MyFormDataStructure {
  fields: UsuarioList;
  controls: {
    fechaCreacion: AbstractControl;
    nombres: AbstractControl;
    apellidos: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    confirmPassword: AbstractControl;
    email: AbstractControl;
    telefono: AbstractControl;
    estado: AbstractControl;
    idProveedor: AbstractControl;
    proveedor: AbstractControl;
    idPerfil: AbstractControl;
    perfil: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  loading: boolean;
  // perfiles = {} as SelectionModel[];
  perfiles$: Observable<SelectionModel[]>;
  proveedores$: Observable<SelectionModel[]>;
  accountSubscription = new Subscription();
  perfilesLoaded$ = this.store.select(state => state.perfil.loaded);
  proveedoresLoaded$ = this.store.select(state => state.proveedor.loaded);
  idProveedor: number;
  // @Input() public elementIndex;
  @Input() public user: UsuarioListComp;
  form: MyForm;

  constructor(
    public store: Store<AppState>, public activeModal: NgbActiveModal, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.accountSubscription = this.store.select(state => state.account.usuario.proveedor.idProveedor)
      .subscribe(idProveedor => {
        this.idProveedor = idProveedor;
      });

    this.perfilesLoaded$.subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(new actions.perfil.CargarPerfiles());
      } else {
        // this.store.select('account')
        while (!this.idProveedor) { }
        this.getPerfilesFromStore(this.idProveedor);
      }
    });

    this.proveedoresLoaded$.subscribe(loaded => {
      if (!loaded) {
        while (!this.idProveedor) { }
        this.store.dispatch(new actions.proveedor.CargarProveedores(this.idProveedor));
      } else {
        this.getProveedoresFromStore();
      }
    });

    this.form = this.formBuilder.group({
      fechaCreacion: this.user.fechaCreacion,
      nombres: [this.user.nombres, Validators.required],
      apellidos: [this.user.apellidos, Validators.required],
      username: [this.user.username, Validators.required],
      password: '',
      confirmPassword: '',
      email: [this.user.email, Validators.required],
      telefono: [this.user.telefono, Validators.required],
      estado: [this.user.estado, Validators.required],
      idProveedor: [this.user.idProveedor, Validators.required],
      proveedor: [this.user.proveedor, Validators.required],
      idPerfil: [this.user.idPerfil, Validators.required],
      perfil: [this.user.perfil, Validators.required],
    }) as MyForm;
  }

  get flds() {
    return this.form.value;
  }

  get ctrls() {
    return this.form.controls;
  }

  getErrorMessage(fc: FormControl) {
    let resp = '';
    resp += fc.hasError('required') ? 'Debe ingresar un valor. ' : '';
    resp += fc.hasError('minlength') ? 'Debe ingresar mínimo 6 dígitos. ' : '';
    resp += fc.hasError('loteValidator')
      ? 'Debe empezar con fecha mayor que la actual y en formato AAMMDD. '
      : '';
    console.log(resp);
    return resp;
  }

  getPerfilesFromStore(idProveedor: number) {
    this.perfiles$ = this.store.select(state => state.perfil.perfiles).pipe(
      map(item => {
        console.log('state.perfil.perfiles');
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
        console.log('state.perfil.proveedores');
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

  passBack() {
    // this.passEntry.emit(this.user);
    this.activeModal.close();
  }

}
