import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ClienteList } from 'src/app/models/reports.model';



@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {

  loading$: Observable<boolean>;
  clientes = {} as ClienteList[];

  getUsersFromStoreSubscription = new Subscription();

  pageSize = 10;
  page = 1;

  textFilter = new FormControl('');
  date1Filter = new FormControl('');

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }


}
