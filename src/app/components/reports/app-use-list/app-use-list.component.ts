import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUseList } from 'src/app/models/reports.model';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
import * as XLSX from 'xlsx';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-app-use-list',
  templateUrl: './app-use-list.component.html',
  styleUrls: ['./app-use-list.component.scss']
})
export class AppUseListComponent implements OnInit, OnDestroy {
  anho = 2019;
  loading = false;
  appUseList: AppUseList[];
  subscription = new Subscription();

  pageSize = 10;
  page = 1;


  constructor(private reportsService: ReportsService, private utilService: UtilService, private translateService: TranslateService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ok() {
    this.loading = true;
    this.subscription = this.reportsService
      .getAppUse(
        this.anho
      ).pipe(map((items: AppUseList[]) => items.map(item => {
        {
          return {
            anho: item.anho,
            descripcion: this.translateService.instant('PAGES.UseApp.' + item.descripcion),
            enero: item.enero,
            febrero: item.febrero,
            marzo: item.marzo,
            abril: item.abril,
            mayo: item.mayo,
            junio: item.junio,
            julio: item.julio,
            agosto: item.agosto,
            septiembre: item.septiembre,
            octubre: item.octubre,
            noviembre: item.noviembre,
            diciembre: item.diciembre
          };
        }
      }))).subscribe(
        result => {
          // if (permisos.length === 0) return;

          this.appUseList = result;
          this.loading = false;
        },
        (/*error*/) => { }
      );
  }

  download() {
    console.log('Export to Excel');
    // this.jsonExcel();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.appUseList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');

    XLSX.writeFile(wb, 'Listado de Productos por Clientes.xlsx');
  }


}
