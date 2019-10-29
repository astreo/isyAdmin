import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'star-admin-angular';
  autenticathed = false;


  constructor(private translate: TranslateService, private router: Router, public store: Store<AppState>) {
    translate.setDefaultLang('es');
  }

  ngOnInit() {
    this.store.select('account')
      .subscribe(result => {
        this.autenticathed = result.authenticated;
        if (!this.autenticathed) { this.router.navigate(['/login']); }
      });
  }
}
