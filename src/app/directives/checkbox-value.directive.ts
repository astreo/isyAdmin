import {
  Directive,
  Input,
  forwardRef,
  HostListener,
  ElementRef,
  Renderer2
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'input[type=checkbox][trueFalseValue]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxValueDirective),
      multi: true
    }
  ]
})
export class CheckboxValueDirective implements ControlValueAccessor {
  @Input() trueValue = true;
  @Input() falseValue = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('change', ['$event'])
  onHostChange(ev) {
    this.propagateChange(ev.target.checked ? this.trueValue : this.falseValue);
  }

  writeValue(obj: any): void {
    if (obj === this.trueValue) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'checked', true);
    } else {
      this.renderer.setProperty(this.elementRef.nativeElement, 'checked', false);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
