import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PeticionesService } from '../../../services/peticiones.service';
import { Subscription, Observable } from 'rxjs';
import { Asistencia } from 'src/app/models/asistencia.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-services-detail',
  templateUrl: './services-detail.component.html',
  styleUrls: ['./services-detail.component.scss']
})
export class ServicesDetailComponent implements OnInit, OnDestroy {
  formTitle: string;
  asistencia = {} as Asistencia;
  @Input() idSolicitudServicio: number;
  @Input() servicio: string;
  subscription: Subscription;
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(private peticionesService: PeticionesService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    let action: Observable<any>;
    // debugger;
    if (this.servicio.toUpperCase() === 'EMEPER') {
      this.formTitle = 'PAGES.ModalTitles.EmergencyDetail';
      action = this.peticionesService.getDetalleEmergencia(this.idSolicitudServicio);
    } else {
      this.formTitle = 'PAGES.ModalTitles.ServiceDetail';
      action = this.peticionesService.getDetalleServicio(this.idSolicitudServicio);
    }
    this.subscription = action.subscribe(
      result => {
        console.log(result);
        this.asistencia = result;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
