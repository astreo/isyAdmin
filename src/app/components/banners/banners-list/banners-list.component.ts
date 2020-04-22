import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Banner } from '../../../models/banner.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BannersService } from '../../../services/banners.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss']
})
export class BannersListComponent implements OnInit, OnDestroy {

  FormType = FormType;
  formType: FormType;
  loading: boolean;
  banners = {} as Banner[];
  banners$: Observable<Banner[]>;

  listSubscription = new Subscription();
  actionSubscription = new Subscription();
  deleteSubscription = new Subscription();

  pageSize = 6;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public confirmationDialogService: ConfirmationDialogService, public modalService: NgbModal,
    private bannersService: BannersService) { }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
  }

  getList() {
    this.loading = true;
    this.listSubscription = this.bannersService.getBanners().subscribe(result => {
      this.loading = false;
      this.banners = result;
      console.log(this.banners);
      this.banners$ = this.textFilter.valueChanges.pipe(
        startWith(''),
        map(text => this.searchText(text))
      );
    });
  }

  searchText(text: string): Banner[] {
    return this.banners.filter(banners => {
      const term = text.toLowerCase();
      return banners.rangoFechas.toLowerCase().includes(term)
        ;
    });
  }

}
