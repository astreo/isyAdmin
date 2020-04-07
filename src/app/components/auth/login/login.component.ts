import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../../store/app.reducer';
import { LoginData } from 'src/app/models/usuario.model';
import { Store } from '@ngrx/store';
// import { Usuario } from '../../../models/usuario.model';
import { usuario as actions } from '../../../store/actions';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean;
  loading$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  subscription: Subscription;

  constructor(public store: Store<AppState>) { }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.account.loading);
    this.authenticated$ = this.store.select(state => state.account.authenticated);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  onSubmit(data: LoginData) {
    /* this.subscription = this.store.select('account')
      .subscribe(result => {
        this.loading = result.loading;
      });*/
    this.store.dispatch(new actions.CargarUsuario(data));
  }

}
