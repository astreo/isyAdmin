import { Component, OnInit, OnDestroy } from '@angular/core';
import { Portfolio, AppUseList } from '../../../models/reports.model';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customers-portfolio-list',
  templateUrl: './customers-portfolio-list.component.html',
  styleUrls: ['./customers-portfolio-list.component.scss']
})
export class CustomersPortfolioListComponent implements OnInit, OnDestroy {
  anho = 2019;
  loading = false;
  portfolioList: AppUseList[];
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
      .getPortfolio(
        this.anho
      ).subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.formatData(result);
          // this.portfolioList = result;
          this.loading = false;
        },
        (/*error*/) => { }
      );
  }

  formatData(list: Portfolio[]) {
    // debugger;
    this.portfolioList = [{
      anho: list[0].anho,
      descripcion: this.translateService.instant('PAGES.TableDescriptions.Registrations'),
      enero: list[0] ? list[0].altas : '',
      febrero: list[1] ? list[1].altas : '',
      marzo: list[2] ? list[2].altas : '',
      abril: list[3] ? list[3].altas : '',
      mayo: list[4] ? list[4].altas : '',
      junio: list[5] ? list[5].altas : '',
      julio: list[6] ? list[6].altas : '',
      agosto: list[7] ? list[7].altas : '',
      septiembre: list[8] ? list[8].altas : '',
      octubre: list[9] ? list[9].altas : '',
      noviembre: list[10] ? list[10].altas : '',
      diciembre: list[11] ? list[11].altas : '',
    } as AppUseList,
    {
      anho: list[0].anho,
      descripcion: this.translateService.instant('PAGES.TableDescriptions.Connected'),
      enero: list[0] ? list[0].carteraConectados : '',
      febrero: list[1] ? list[1].carteraConectados : '',
      marzo: list[2] ? list[2].carteraConectados : '',
      abril: list[3] ? list[3].carteraConectados : '',
      mayo: list[4] ? list[4].carteraConectados : '',
      junio: list[5] ? list[5].carteraConectados : '',
      julio: list[6] ? list[6].carteraConectados : '',
      agosto: list[7] ? list[7].carteraConectados : '',
      septiembre: list[8] ? list[8].carteraConectados : '',
      octubre: list[9] ? list[9].carteraConectados : '',
      noviembre: list[10] ? list[10].carteraConectados : '',
      diciembre: list[11] ? list[11].carteraConectados : '',
    } as AppUseList,
    {
      anho: list[0].anho,
      descripcion: this.translateService.instant('PAGES.TableDescriptions.PortfolioPerMonth'),
      enero: list[0] ? list[0].carteraMes : '',
      febrero: list[1] ? list[1].carteraMes : '',
      marzo: list[2] ? list[2].carteraMes : '',
      abril: list[3] ? list[3].carteraMes : '',
      mayo: list[4] ? list[4].carteraMes : '',
      junio: list[5] ? list[5].carteraMes : '',
      julio: list[6] ? list[6].carteraMes : '',
      agosto: list[7] ? list[7].carteraMes : '',
      septiembre: list[8] ? list[8].carteraMes : '',
      octubre: list[9] ? list[9].carteraMes : '',
      noviembre: list[10] ? list[10].carteraMes : '',
      diciembre: list[11] ? list[11].carteraMes : '',
    } as AppUseList
   ];
  }

  download() {
    console.log('Export to Excel');
    // this.jsonExcel();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.portfolioList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');

    XLSX.writeFile(wb, 'Cartera de Clientes.xlsx');
  }


}
