import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  cambiaIdioma(idioma: string) {
    console.log(`Traduzco a: ${idioma}`);
    this.translate.use(idioma);
  }

}
