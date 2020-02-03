import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Panel } from '../../models/paneles.model';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PanelesService } from '../../services/paneles.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-panels-dialog',
  templateUrl: './panels-dialog.component.html',
  styleUrls: ['./panels-dialog.component.scss']
})
export class PanelsDialogComponent implements OnInit, OnDestroy {
  loading: boolean;
  panels = {} as Panel[];
  panels$: Observable<Panel[]>;

  loadedSubsctiption = new Subscription();
  subscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(private panelesService: PanelesService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loadedSubsctiption.unsubscribe();
  }


  getList() {
    this.loading = true;
    this.subscription = this.panelesService.getPaneles()
      .subscribe(result => {
        this.loading = false;
        this.panels = result;
        this.panels$ = this.textFilter.valueChanges.pipe(
          startWith(''),
          map(text => this.searchText(text))
        );
      });
  }


  searchText(text: string): Panel[] {
    return this.panels.map((obj) => {
      obj.tipoComunicador = obj.tipoComunicador ? obj.tipoComunicador : '';
      return obj;
    }).filter(panels => {
      const term = text.toLowerCase();
      return panels.customerId.toLowerCase().includes(term)
        || panels.tipoComunicador.toLowerCase().includes(term)
        || panels.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

  doubleClick (item: Panel) {
    console.log('cliente:', item);
    this.ok(item);
  }

  ok(item: Panel) {

    this.passEntry.emit(item);
    this.activeModal.close(item);
  }

}
