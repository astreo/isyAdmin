import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType } from '../../../models/enum';
import { Noticia } from '../../../models/noticia.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoticiasService } from 'src/app/services/noticias.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  FormType = FormType;
  formType: FormType;
  loading: boolean;
  news = {} as Noticia[];
  news$: Observable<Noticia[]>;

  listSubscription = new Subscription();
  actionSubscription = new Subscription();
  deleteSubscription = new Subscription();

  pageSize = 6;
  page = 1;

  textFilter = new FormControl('');

  constructor(public utilService: UtilService, public confirmationDialogService: ConfirmationDialogService, public modalService: NgbModal,
              private noticiasService: NoticiasService) { }

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
    this.listSubscription = this.noticiasService.getNoticias().subscribe(result => {
      this.loading = false;
      this.news = result;
      console.log(this.news);
      this.news$ = this.textFilter.valueChanges.pipe(
        startWith(''),
        map(text => this.searchText(text))
      );
    });
  }

  openModal(formType: FormType, item?: Noticia) {
  }

  searchText(text: string): Noticia[] {
    return this.news.filter(news => {
      const term = text.toLowerCase();
      return news.titulo.toLowerCase().includes(term)
        || news.contenido.toLowerCase().includes(term)
        || news.fechaCreacion.toLowerCase().includes(term)
        ;
    });
  }

}
