import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ISY';
  autenticathed = false;
  authSubscription = new Subscription();
  routerSubscription = new Subscription();
  currentUrl: string;

  constructor(private translate: TranslateService, private router: Router, public store: Store<AppState>) {
    // translate.setDefaultLang('es');
    /*let userLang = navigator.language.split('-')[0];
    userLang = /(en|de|it|fr|es|be)/gi.test(userLang) ? userLang : 'en';
    this.translate.use(userLang);*/
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
  }

  ngOnInit() {
    const links = document.getElementsByTagName('a');

for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('data-href', links[i].getAttribute('href'));
    links[i].removeAttribute('href');
    links[i].onclick = function() {
        window.location.href = links[i].getAttribute('data-href');
    };
}
    this.routerSubscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url.split(';')[0];
      }
    });

    this.authSubscription = this.store.select('account')
      .subscribe(result => {
        this.autenticathed = result.authenticated;
        if (!this.autenticathed && this.currentUrl !== '/newPwd') { this.router.navigate(['/login']); }
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
