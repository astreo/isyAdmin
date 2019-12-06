import { equalValidator } from './../../../validators/equal.validator';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, AbstractControl, NgModel } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import Swal from 'sweetalert2';
import { UsuarioNewPwd } from '../../../models/usuario.model';

@Component({
  selector: 'app-new-pwd',
  templateUrl: './new-pwd.component.html',
  styles: []
})
export class NewPwdComponent implements OnInit, OnDestroy {
  procesando = false;
  subscription = new Subscription();
  // equalValidatorVar = equalValidator;
  password: string;
  confirmPassword: string;
  username: string;

  constructor(private route: ActivatedRoute, public authService: AccountService, private router: Router) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isInvalid(model: NgModel) {
    const ctrl = model.control;
    if (model.name === 'confirmPassword' && !ctrl.pristine) {
      const res = equalValidator('password', 'confirmPassword') (ctrl);
      if (res) {
        ctrl.setErrors({'equalValidator': true});
      }
    }
    return (ctrl.touched && ctrl.invalid);
  }

  isNotEqual(ctrl: AbstractControl) {
    equalValidator('password', 'password') (ctrl);
  }

  getErrorMessage(fc: FormControl) {
    let resp = '';
    resp += fc.hasError('required') ? 'Debe ingresar un valor. ' : '';
    resp += fc.hasError('minlength') ? 'Debe ingresar mínimo 6 dígitos. ' : '';
    resp += fc.hasError('equalValidator') ? 'Los valores no coinciden ' : '';
    return resp;
  }

  onSubmit(data: UsuarioNewPwd) {
    this.procesando = true;
    data.user = this.username;
    this.subscription = this.authService.updatePwd(data).subscribe(
      (/*suc*/) => {
        this.router.navigate(['/login']);
      },
      error => {
        this.procesando = false;
        Swal.fire({
          title: 'Error!',
          text: error.message,
          type: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

}
