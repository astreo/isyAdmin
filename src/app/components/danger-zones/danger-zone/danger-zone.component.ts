import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Subscription } from 'rxjs';
import { ZonaPeligrosa } from '../../../models/zonas-peligrosas.model';
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

  /*paths = [
    { lat: -25.279512912004993, lng: -57.558641266270456 },
    { lat: -25.279652369439205, lng: -57.558837067528543 },
    { lat: -25.279772423971558, lng: -57.558858525200662 },
    { lat: -25.279898541736181, lng: -57.558731120272455 },
    { lat: -25.279785763356703, lng: -57.558532636805353 },
    { lat: -25.279785763356703, lng: -57.558531295700845 }
  ];*/

  paths = [] as { lat: number, lng: number }[];

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

    this.getCurrentPath();
    this.initialLat = this.paths[0].lat;
    this.initialLng = this.paths[0].lng;
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
    this.zona.vertice.forEach(element => {
      this.paths.push({ lat: element.latitud, lng: element.longitud });
    });
  }


  onMapReady(map) {
    this.initDrawingManager(map);
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
        alert(event.overlay.getPath().getArray());
        this.paths = [];
      }
    });
  }

  ok() {
    // this.punto = this.form.value;
    // this.punto.latitud = this.lat;
    // this.punto.longitud = this.lng;
    // debugger;
    this.passEntry.emit(this.zona);
    this.activeModal.close(this.zona);
  }

}
