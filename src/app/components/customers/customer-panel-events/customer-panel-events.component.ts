import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PersonaPanelEvento } from 'src/app/models/relaciones.model';
import { Subscription } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-panel-events',
  templateUrl: './customer-panel-events.component.html',
  styleUrls: ['./customer-panel-events.component.scss']
})
export class CustomerPanelEventsComponent implements OnInit {
  @Input() idPersonaPanel;
  getEventosPanelSubscription = new Subscription();
  panelEventos = {} as PersonaPanelEvento[];
  loading = false;

  constructor(public clientesService: ClientesService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getPersonaPanelEventos(this.idPersonaPanel);
  }

  getPersonaPanelEventos(idPersona: number) {
    this.loading = true;
    this.getEventosPanelSubscription = this.clientesService.getPersonaPanelEventos(idPersona)
      .subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            Swal.fire({
              title: 'Atencion!',
              text: 'Este Panel todavía no tiene eventos asociados',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            console.log('PersonaPanel: ' + JSON.stringify(result));
            this.panelEventos = result;
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

}
