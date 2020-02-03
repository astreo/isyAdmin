import { Gps } from './../../models/gps.model';
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { GpsService } from '../../services/gps.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-gps-dialog',
  templateUrl: './gps-dialog.component.html',
  styleUrls: ['./gps-dialog.component.scss']
})
export class GpsDialogComponent implements OnInit, OnDestroy {
  loading: boolean;
  gpsList = {} as Gps[];
  gpsList$: Observable<Gps[]>;

  loadedSubsctiption = new Subscription();
  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(private gpsService: GpsService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
  }


  getList() {
    this.loading = true;
    this.subscription = this.gpsService.getGpsList()
      .subscribe(result => {
        this.loading = false;
        this.gpsList = result;
        this.gpsList$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );
      });
  }


  searchText(text: string): Gps[] {
    return this.gpsList.map((obj) => {
      obj.fechaUltimaPosicion = obj.fechaUltimaPosicion ? obj.fechaUltimaPosicion : '';
      return obj;
    }).filter(gpsList => {
      const term = text.toLowerCase();
      return gpsList.patente.toLowerCase().includes(term)
        || gpsList.fechaUltimaPosicion.toLowerCase().includes(term)
        || gpsList.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

  doubleClick (item: Gps) {
    console.log('cliente:', item);
    this.ok(item);
  }

  ok(item: Gps) {

    this.passEntry.emit(item);
    this.activeModal.close(item);
  }

}
