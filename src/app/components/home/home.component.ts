import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private translate: TranslateService) { }
  ngOnDestroy(): void {
    window.onpopstate = null;
    console.log('hola');
  }

  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); };
  }

  cambiaIdioma(idioma: string) {
    console.log(`Traduzco a: ${idioma}`);
    this.translate.use(idioma);
  }

}
