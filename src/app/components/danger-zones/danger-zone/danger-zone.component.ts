import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Subscription } from 'rxjs';
import { ZonaPeligrosa, Vertice } from '../../../models/zonas-peligrosas.model';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare class MyFormDataStructure {
  fields: ZonaPeligrosa;
  controls: {
    // idPuntoInteres: AbstractControl;
    nombre: AbstractControl;
    mensaje: AbstractControl;
    estado: AbstractControl;
    visible: AbstractControl;
  };
}

declare interface MyForm extends FormGroup {
  value: MyFormDataStructure['fields'];
  controls: MyFormDataStructure['controls'];
}

declare const google: any;

@Component({
  selector: 'app-danger-zone',
  templateUrl: './danger-zone.component.html',
  styleUrls: ['./danger-zone.component.scss']
})
export class DangerZoneComponent implements OnInit {
  formTitle: string;
  FormType = FormType;
  loading: boolean;
  subscription = new Subscription();

  initialLat: number;
  initialLng: number;

  drawingManager: any;
  polygon: any;

  /*paths = [
    { lat: -25.279512912004993, lng: -57.558641266270456 },
    { lat: -25.279652369439205, lng: -57.558837067528543 },
    { lat: -25.279772423971558, lng: -57.558858525200662 },
    { lat: -25.279898541736181, lng: -57.558731120272455 },
    { lat: -25.279785763356703, lng: -57.558532636805353 },
    { lat: -25.279785763356703, lng: -57.558531295700845 }
  ];*/

  paths = [] as { lat: number, lng: number }[];
  newPaths = [] as Vertice[];

  @Input() formType: FormType;
  @Input() public zona: ZonaPeligrosa;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form: MyForm;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // debugger;
    switch (this.formType) {
      case FormType.NEW:
        this.formTitle = 'PAGES.ModalTitles.CreateNewDangerZone';
        break;
      case FormType.EDIT:
        this.formTitle = 'PAGES.ModalTitles.EditDangerZone';
        break;
      default:
        break;
    }

    this.form = this.formBuilder.group({
      nombre: [this.zona.nombre, Validators.required],
      mensaje: [this.zona.mensaje, Validators.required],
      estado: [this.zona.estado, Validators.required],
      visible: [this.zona.visible, Validators.required],
    }) as MyForm;

    if (this.zona.vertice && this.zona.vertice.length !== 0) {
      this.getCurrentPath();
      this.initialLat = this.paths[0].lat;
      this.initialLng = this.paths[0].lng;
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

  getCurrentPath() {
    this.paths = [] as { lat: number, lng: number }[];
    this.zona.vertice.forEach(element => {
      this.paths.push({ lat: element.latitud, lng: element.longitud });
    });
  }

  getCurrentPos() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.initialLat = position.coords.latitude;
          this.initialLng = position.coords.longitude;
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

  onMapReady(map) {
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('reset'));
    this.initDrawingManager(map);
  }

  resetMap() {
    this.polygon.setMap(null);
    this.getCurrentPath();
    this.drawingManager.setDrawingMode('polygon');
    this.zona.nuevo = false;
  }

  initDrawingManager(map: any) {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon']
      },
      polygonOptions: {
        paths: this.paths,
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      // Polygon drawn
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        // this is the coordinate, you can assign it to a variable or pass into another function.
        this.newPaths = [];
        // alert(event.overlay.getPath().getArray());
        event.overlay.getPath().getArray().forEach(element => {
          const fields = element.toUrlValue(13).split(',');
          const obj = {
            idGeocerca: this.zona.idGeocerca,
            latitud: +fields[0],
            longitud: +fields[1]
          } as Vertice;
          // newPaths.push(element.toUrlValue(13));
          this.newPaths.push(obj);
        });
        this.zona.vertices = event.overlay.getPath().getArray().toString();
        this.zona.nuevo = true;
        // event.overlay.setMap(null);
        this.polygon = event.overlay;
        this.drawingManager.setDrawingMode(null);
        this.paths = [];

        console.log(this.paths[0], 'paths');
        console.log(this.newPaths, 'newPaths');
      }
    });
  }

  ok() {
    // this.zona = this.form.value;
    Object.assign(this.zona, this.form.value);
    // this.punto.latitud = this.lat;
    // this.punto.longitud = this.lng;
    // debugger;
    this.zona.vertice = this.newPaths;
    this.passEntry.emit(this.zona);
    this.activeModal.close(this.zona);

    console.log('Elaboracion: ' + JSON.stringify(this.zona));
  }

}
