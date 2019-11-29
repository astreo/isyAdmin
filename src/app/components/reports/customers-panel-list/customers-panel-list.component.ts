import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClienteList } from 'src/app/models/reports.model';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customers-panel-list',
  templateUrl: './customers-panel-list.component.html',
  styleUrls: ['./customers-panel-list.component.scss']
})
export class CustomersPanelListComponent implements OnInit, OnDestroy {
  loading = false;
  clientes: ClienteList[];
  subscription = new Subscription();
  id: string;

  pageSize = 10;
  page = 1;

  constructor(private reportsService: ReportsService, private utilService: UtilService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ok() {
    this.loading = true;
    this.subscription = this.reportsService
      .getClientesPorPanel(
        this.id
      ).pipe(map((items: ClienteList[]) => items.map(item => {
        {
          return {
            fechaCreacion: item.fechaCreacion,
            nroDocumento: item.nroDocumento,
            ruc: item.ruc,
            nombres: item.nombres,
            apellidos: item.apellidos,
            email: item.email,
            telefono: item.telefono,
            esCliente: item.esCliente,
            esTitular: item.esTitular,
            personaJuridica: item.personaJuridica,
            dependientes: item.dependientes
          };
        }
      })))
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          console.log(JSON.stringify(result));
          this.clientes = result;
          const removables = ['esCliente', 'esTitular', 'personaJuridica', 'dependientes'];
          this.clientes.forEach(function (item) {
            removables.forEach(prop => {
              delete item[prop];
            });
           });
          this.loading = false;
        },
        (/*error*/) => { }
      );
  }

  download() {
    console.log('Export to Excel');
    // this.jsonExcel();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.clientes);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');

    XLSX.writeFile(wb, `Listado de Clientes por Panel ${this.id}.xlsx`);
  }


}
