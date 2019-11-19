import { AbstractControl } from '@angular/forms';

export function equalValidator(field1: string, field2: string) {
  return function(c: AbstractControl): any {
    // debugger;
    console.log('hola');
    if (!c.parent || !c) { return; }
    const pwd = c.parent.get(field1);
    const cpwd = c.parent.get(field2);
    if (!pwd.value || !cpwd.value) { return; }
    if (pwd.value !== cpwd.value) {
      return { equalValidator: true };
    } else {
      pwd.setErrors(null);
      cpwd.setErrors(null);
    }
  };
}
