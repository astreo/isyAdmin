import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-range-dates-dialog',
  templateUrl: './range-dates-dialog.component.html',
  styleUrls: ['./range-dates-dialog.component.scss']
})
export class RangeDatesDialogComponent implements OnInit {
  @Input() public rangoFechas;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  startDate = {} as any;
  constructor(public activeModal: NgbActiveModal, public utilService: UtilService) { }

  ngOnInit() {
    const fechas = this.rangoFechas.split(' - ');
    this.fromDate = this.utilService.stringToNgbDate(fechas[0]);
    this.startDate.year = this.fromDate.year;
    this.startDate.month = this.fromDate.month;
    // this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.toDate = this.utilService.stringToNgbDate(fechas[1]);
  }

  onDateSelection(date: NgbDate) {
    console.log('onDateSelection: ', date);
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    // console.log('isHovered');
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    // console.log('isInside');
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    // console.log('isRange');
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  ok() {
    // this.banner = this.form.value;
    /*this.noticia.latitud = this.lat;
    this.noticia.longitud = this.lng;*/
    console.log('fromDate:', this.fromDate);
    console.log('fromDate:', this.toDate);

    this.rangoFechas = this.utilService.ngbDateToString(this.fromDate, '/', 'mmddyyyy') + ' 12:00:00 AM - '
                       + this.utilService.ngbDateToString(this.toDate, '/', 'mmddyyyy') + ' 11:59:00 PM';

    console.log('rangoFechas:', this.rangoFechas);

    this.passEntry.emit(this.rangoFechas);
    this.activeModal.close(this.rangoFechas);
  }


}
