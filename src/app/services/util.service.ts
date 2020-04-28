import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  toParams = function ObjectsToParams(obj) {
    const p = [];
    // tslint:disable-next-line:forin
    for (const key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
  };

  public getHeather(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  dateToString({date = new Date(), separator = '-', returnFormat = 'yyyymmdd'}): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let formatedDate: string;
    switch (returnFormat) {
      case 'yyyymmdd':
        formatedDate = `${year}${separator}${month}${separator}${day}`;
        break;

      case 'mmddyyyy':
        formatedDate = `${month}${separator}${day}${separator}${year}`;
    }
    return formatedDate;
  }

  stringToNgbDate(dateString: string): NgbDate {
    const dateArray = dateString.split(/[\s/]+/, 3);
    const ngbDateStruct = { day: +dateArray[1], month: +dateArray[0], year: +dateArray[2] };
    return NgbDate.from(ngbDateStruct);
  }

  ngbDateToString(date: NgbDate, separator = '-', returnFormat = 'yyyymmdd'): string {
    // debugger;
    if (date) {
      const day = date.day;
      const month = date.month;
      const year = date.year;
      let formatedDate: string;
      switch (returnFormat) {
        case 'yyyymmdd':
          formatedDate = `${year}${separator}${month}${separator}${day}`;
          break;

        case 'mmddyyyy':
          formatedDate = `${month}${separator}${day}${separator}${year}`;
      }
      return formatedDate;
    } else {
      return `1900${separator}01${separator}01`;
    }
  }

  textToTitleCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  textToPhone(text: string): string {
    let phone: string;
    phone = text.replace(/\+/g, '').replace(/\s/g, '');
    // debugger;
    return phone;
  }

  getErrorMessage(fc: FormControl) {
    let resp = '';
    resp += fc.hasError('required') ? 'Debe ingresar un valor. ' : '';
    resp += fc.hasError('minlength') ? 'Debe ingresar mínimo 6 dígitos. ' : '';
    resp += fc.hasError('maxlength') ? 'Ha excedido la cantidad de caracteres. ' : '';
    resp += fc.hasError('equalValidator') ? 'Los valores no coinciden ' : '';
    return resp;
  }
}
