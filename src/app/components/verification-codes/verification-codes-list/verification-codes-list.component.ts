import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../services/reports.service';
import { UtilService } from '../../../services/util.service';
import { CodigoVerificacionList } from 'src/app/models/reports.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verification-codes-list',
  templateUrl: './verification-codes-list.component.html',
  styleUrls: ['./verification-codes-list.component.scss']
})
export class VerificationCodesListComponent implements OnInit, OnDestroy {
  loading = false;
  codigoList = {} as CodigoVerificacionList;
  subscription = new Subscription();
  id: string;
  phone: string;

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
      .getCodigosPorTelefono(
        this.utilService.textToPhone(this.phone)
      )
      .subscribe(
        result => {
          // if (permisos.length === 0) return;
          this.loading = false;
          // debugger;
          if (result.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: 'Cliente no encontrado',
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
          this.codigoList = result[0];
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
