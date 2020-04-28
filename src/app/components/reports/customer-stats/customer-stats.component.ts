import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// import { NgbDate } from '../../../models/misc.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { ClientesEstadistica } from '../../../models/reports.model';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-customer-stats',
  templateUrl: './customer-stats.component.html',
  styleUrls: ['./customer-stats.component.scss']
})
export class CustomerStatsComponent implements OnInit, OnDestroy {
  fecha: NgbDate;
  loading = false;
  estadisticas: ClientesEstadistica;
  subscription = new Subscription();

  pageSize = 10;
  tab1Page = 1;
  tab2Page = 1;

  date1Filter = new FormControl('');

  constructor(private reportsService: ReportsService, private utilService: UtilService) { }

  ngOnInit() {
    const date = new Date();
    this.fecha = NgbDate.from({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
    this.getData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    this.loading = true;
    this.subscription = this.reportsService
      .getEstadisticaClientes(
        this.utilService.ngbDateToString(this.fecha),
      ).subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.estadisticas = result;
          this.estadisticas.total = this.estadisticas.totalAndroid +  this.estadisticas.totalIos;
          this.estadisticas.porcentAndroid = +((this.estadisticas.totalAndroid * 100) / this.estadisticas.total).toFixed(2);
          this.estadisticas.porcentIos = +((this.estadisticas.totalIos * 100) / this.estadisticas.total).toFixed(2);
          this.estadisticas.versionesAndroid.forEach(item => {
            item.porcentaje = +((item.total * 100) / this.estadisticas.totalAndroid).toFixed(2);
          });
          this.estadisticas.versionesIos.forEach(item => {
            item.porcentaje = +((item.total * 100) / this.estadisticas.totalIos).toFixed(2);
          });
          this.loading = false;
        },
        (/*error*/) => { }
      );
  }


}
