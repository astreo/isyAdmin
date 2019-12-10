import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { NgbDate } from '../models/misc.model';

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

  dateToString(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  ngbDateToString(date: NgbDate): string {
    // debugger;
    if (date) {
      const day = date.day;
      const month = date.month;
      const year = date.year;
      return `${year}-${month}-${day}`;
    } else {
      return '1900-01-01';
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
}
