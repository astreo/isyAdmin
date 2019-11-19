import { equalValidator } from './../../../validators/equal.validator';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, AbstractControl, NgModel } from '@angular/forms';

@Component({
  selector: 'app-new-pwd',
  templateUrl: './new-pwd.component.html',
  styles: []
})
export class NewPwdComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription = new Subscription();
  // equalValidatorVar = equalValidator;
  password: string;
  confirmPassword: string;
  ac: AbstractControl;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    equalValidator(this.password, this.confirmPassword);
    // debugger;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isInvalid(model: NgModel) {
    const ctrl = model.control;
    if (model.name === 'confirmPassword' && !ctrl.pristine) {
      const res = equalValidator('password', 'confirmPassword') (ctrl);
      ctrl.setErrors({'equalValidator': res});
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



  onSubmit(data: any) {
    debugger;
    const res = equalValidator('password', 'confirmPassword');
    console.log(data);

  }

}
