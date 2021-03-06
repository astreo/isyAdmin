import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClienteList } from 'src/app/models/reports.model';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
// import { NgbDate } from 'src/app/models/misc.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-products-customers-list',
  templateUrl: './products-customers-list.component.html',
  styleUrls: ['./products-customers-list.component.scss']
})
export class ProductsCustomersListComponent implements OnInit, OnDestroy {
  fechaInicio: NgbDate;
  fechaFin: NgbDate;
  tipo = 'TO';
  myFecha = false;
  loading = false;
  clientes: ClienteList[];
  subscription = new Subscription();

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
      .getProductosPorClienteList(
        this.utilService.ngbDateToString(this.fechaInicio),
        this.utilService.ngbDateToString(this.fechaFin),
        this.tipo,
        this.myFecha
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
            tienePanel: item.tienePanel,
            tieneGps: item.tieneGps
          };
        }
      })))
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.clientes = result;
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

    XLSX.writeFile(wb, 'Listado de Uso de la App.xlsx');
  }


}
