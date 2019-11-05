import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioListComp } from '../../../models/usuarios.model';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as actions from '../../../store/actions';
import { map } from 'rxjs/operators';
import { SelectionModel } from 'src/app/models/misc.model';
import { Subscription } from 'rxjs';

declare class MyFormDataStructure {
  fields: UsuarioListComp;
  controls: {
    // id: AbstractControl;
    fechaCreacion: AbstractControl;
    nombres: AbstractControl;
    apellidos: AbstractControl;
    username: AbstractControl;
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
  perfiles = {} as SelectionModel[];
  proveedores = {} as SelectionModel[];
  accountSuscription = new Subscription();
  // @Input() public elementIndex;
  @Input() public user: UsuarioListComp;
  form: MyForm;

  constructor(
    public store: Store<AppState>, public activeModal: NgbActiveModal, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log('indice en modal: ' + this.user);
    this.accountSuscription = this.store.select('account')
      .subscribe(result => {
        this.getPerfiles(result.usuario.proveedor.idProveedor);
        this.getProveedores(result.usuario.proveedor.idProveedor);
      });

    this.form = this.formBuilder.group({
      fechaCreacion: this.user.fechaCreacion,
      nombres: [this.user.nombres, Validators.required],
      apellidos: [this.user.apellidos, Validators.required],
      username: [this.user.username, Validators.required],
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

  getPerfiles(idProveedor: number) {
    this.store.select('perfil')
    .pipe(
      map(item => ({ perfiles: item.perfiles, loading: item.loading })),
      map(mappedItems => {
        return (({
          perfiles: (mappedItems.perfiles ? mappedItems.perfiles : [])
          .filter(item => item.proveedor.find(a => a.idProveedor === idProveedor))
          .map(item => ({
            id: item.idPerfil,
            descripcion: item.descripcion
          })),
          loading: mappedItems.loading
        })
        );
      }))
    .subscribe(mappedItems => {
      this.perfiles = mappedItems.perfiles;
      console.log('perfiles');
      console.log(this.perfiles);
      this.loading = mappedItems.loading;
      console.log('subscribe');
    });
    this.store.dispatch(new actions.perfil.CargarPerfiles());
  }

  getProveedores(idProveedor: number) {
    this.store.select('proveedor')
    .pipe(
      map(item => ({ proveedores: item.proveedores, loading: item.loading })),
      map(mappedItems => {
        return (({
          proveedores: (mappedItems.proveedores ? mappedItems.proveedores : [])
          // .filter(item => item.proveedor.find(a => a.idProveedor === idProveedor))
          .map(item => ({
            id: item.idProveedor,
            descripcion: item.nombre
          })),
          loading: mappedItems.loading
        })
        );
      }))
    .subscribe(mappedItems => {
      this.proveedores = mappedItems.proveedores;
      console.log('proveedores');
      console.log(this.proveedores);
      this.loading = mappedItems.loading;
      console.log('subscribe');
    });
    this.store.dispatch(new actions.proveedor.CargarProveedores(idProveedor));
  }

  passBack() {
    // this.passEntry.emit(this.user);
    this.activeModal.close();
  }

}
