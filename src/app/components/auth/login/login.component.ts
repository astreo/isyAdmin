import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/app.reducer';
import { LoginData } from 'src/app/models/usuario.model';
import { Store } from '@ngrx/store';
// import { Usuario } from '../../../models/usuario.model';
import { usuario as actions } from '../../../store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {
  loading: boolean;

  constructor(public store: Store<AppState>) { }

  ngOnInit() {
    /*this.subscription = this.store.select('ui')
      .subscribe(ui => this.cargando = ui.isLoading);*/
  }

  onSubmit(data: LoginData) {
    this.store.select('account')
      .subscribe(result => {
        this.loading = result.loading;
      });
    this.store.dispatch(new actions.CargarUsuario(data));
  }

}
