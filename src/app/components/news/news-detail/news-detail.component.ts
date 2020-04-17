import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Noticia } from '../../../models/noticia.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../models/enum';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare class MyFormDataStructure {
  fields: Noticia;
  controls: {
    // fechaCreacion: AbstractControl;
    idNoticia: AbstractControl;
    latitud: AbstractControl;
    longitud: AbstractControl;
    titulo: AbstractControl;
    contenido: AbstractControl;
    linkNoticia: AbstractControl;
    urlImagen: AbstractControl;
    enviado: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();

  initialLat: number; // = 51.678418;
  initialLng: number; // = 7.809007;
  lat: number; // = 51.678418;
  lng: number; // = 7.809007;

  @Input() formType: FormType;
  @Input() public noticia: Noticia;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;


  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.NewNews';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditNews';
        break;
      default:
        break;
    }

    this.form = this.formBuilder.group({
      titulo: [this.noticia.titulo, Validators.required],
      contenido: [this.noticia.contenido, Validators.required],
      linkNoticia: [this.noticia.linkNoticia, Validators.required],
      urlImagen: [this.noticia.urlImagen, Validators.required],
      enviado: [this.noticia.enviado, Validators.required],
      verMapa: true,
    }) as MyForm;

    if (this.noticia.latitud && this.noticia.longitud) {
      this.setCurrentPos();
    } else {
      this.getCurrentPos();
    }
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

  setCurrentPos() {
    this.initialLat = this.noticia.latitud;
    this.initialLng = this.noticia.longitud;
    this.lat = this.noticia.latitud;
    this.lng = this.noticia.longitud;
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
    this.noticia = this.form.value;
    this.noticia.latitud = this.lat;
    this.noticia.longitud = this.lng;
    // debugger;
    this.passEntry.emit(this.noticia);
    this.activeModal.close(this.noticia);
  }

}
