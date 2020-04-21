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
import { NewsDetailComponent } from '../news-detail/news-detail.component';
import Swal from 'sweetalert2';

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
    if (!item) {
      item = {} as Noticia;
      item.enviado = false;
    }
    // const size = (formObject === FormObject.USER) ? 'lg' : 'sm';
    const modalRef = this.modalService.open(NewsDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.noticia = item;
    modalRef.componentInstance.formType = formType;
    modalRef.result.then((result: Noticia) => {
      if (result) {
        console.log('item: ', result);
        // tslint:disable-next-line: no-shadowed-variable
        let action: Observable<any>;
        let actionResult: string;
        if (formType === FormType.NEW) {
          actionResult = 'agregado';
          // action = this.puntosDeInteresService.addPunto(result);
        } else {
          actionResult = 'actualizado';
          // action = this.puntosDeInteresService.updatePunto(item.idPuntoInteres, result);
        }
        this.actionSubscription = action.subscribe(
          response => {
            Swal.fire({
              title: `${this.utilService.textToTitleCase(actionResult)}!`,
              text: `El punto ha sido ${actionResult} con éxito`,
              type: 'success',
              confirmButtonText: 'OK'
            });
            Object.assign(item, result);
            if (formType === FormType.NEW) {
              this.getList();
            }
          }
          ,
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              type: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    });
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
