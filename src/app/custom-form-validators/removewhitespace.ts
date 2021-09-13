import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as _moment from 'moment';

export class RemoveWhitespace {
  /** A hero's name can't match the hero's alter ego */
  static whitespace() {

    return (control: AbstractControl): { [key: string]: any } => {
      // if (control && control.value && typeof control.value != 'number') {
      if (control && control.value && !control.value.toString().replace(/\s/g, '').length) {
        control.setValue('');
        return null;
      }
      if (control && control.value && control.value.toString().length > 2) {
        const split = control.value.toString().split(' ');
        if (split[0] === '') {
          const lastSpace = control.value.toString().trim();
          control.setValue(lastSpace);
        }
        split.reverse();
        if (split[0] === '' && split[1] === '') {
          const lastSpace = control.value.toString().trim();
          control.setValue(lastSpace);
        }
      }
      return null;
    // }
    };
  }
}
