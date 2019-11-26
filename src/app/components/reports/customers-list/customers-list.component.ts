import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ClienteList } from 'src/app/models/reports.model';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
import { NgbDate } from 'src/app/models/misc.model';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {
  fechaInicio: NgbDate;
  fechaFin: NgbDate;
  tipo = 'TO';
  myFecha = false;
  loading$: Observable<boolean>;
  clientes: ClienteList[];
  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');
  date1Filter = new FormControl('');

  constructor(private reportsService: ReportsService, private utilService: UtilService) { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ok() {
    this.subscription = this.reportsService
      .getClientesList(
        this.utilService.ngbDateToString(this.fechaInicio),
        this.utilService.ngbDateToString(this.fechaFin),
        this.tipo,
        this.myFecha
      )
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          console.log('Elaboracion: ' + JSON.stringify(result));
          this.clientes = result;
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

    XLSX.writeFile(wb, 'Listado de Clientes.xlsx');
  }


}
