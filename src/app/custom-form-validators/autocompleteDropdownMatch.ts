import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as _moment from 'moment';

export class FormCustomValidators {
  static statevalueSelected(myArray: any[]): ValidatorFn {

    return (c: AbstractControl): { [key: string]: boolean } | null => {

      const selectboxValue = c.value.state;
      const pickedOrNot = myArray.filter(alias => alias.state === selectboxValue);

      if (pickedOrNot.length > 0) {
        // everything's fine. return no error. therefore it's null.
        return null;

      } else {
        // there's no matching selectboxvalue selected. so return match error.
        return { dropdownNotMatch: true };
      }
    };
  }

  static cityvalueSelected(myArray: any[]): ValidatorFn {

    return (c: AbstractControl): { [key: string]: boolean } | null => {

      const selectboxValue = c.value.City;
      const pickedOrNot = myArray.filter(alias => alias.City === selectboxValue);

      if (pickedOrNot.length > 0) {
        // everything's fine. return no error. therefore it's null.
        return null;

      } else {
        // there's no matching selectboxvalue selected. so return match error.
        return { dropdownNotMatch: true };
      }
    };
  }

  static patternValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      const passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/gm;
      const passRegex1: RegExp = /\s/gm;
      const passRegex2: RegExp = /\s?[, ]\s?/gm;

      // test the value of the control against the regexp supplied
      const valid = passRegex.test(control.value) && !passRegex1.test(control.value) && !passRegex2.test(control.value)
        // tslint:disable-next-line: quotemark
        && !control.value.includes("'") && !control.value.includes('"') && !control.value.includes('&');

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : { passwordvalidator: true };
    };
  }


  static identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const pass = control.get('password');
    const confirm = control.get('confirmpassword');

    return pass && confirm && pass.value !== confirm.value ? { notMatch: true } : null;
  }

  // To  check given date is greater than current date
  static dateValidation(): ValidatorFn {

    return (c: AbstractControl): { [key: string]: boolean } | null => {


      // const selectboxValue = c.value.City;
      // const pickedOrNot = myArray.filter(alias => alias.City === selectboxValue);

      if (c && c.value && c.value.isSameOrAfter(_moment())) {

        // everything's fine. return no error. therefore it's null.
        return null;

      } else {
        // there's no matching selectboxvalue selected. so return match error.
        return { passportNotValid: true };
      }
    };
  }

  static anyOneSelected(g: FormGroup) {
    if (g.get('language').value) {
      if (g.controls.language.value.length > 0) {
        if (g.controls.read.value || g.controls.write.value || g.controls.speak.value) {
          g.controls['read'].setErrors(null);
          return null;
        } else {
          return g.controls['read']['setErrors']({ notSelected: true });
          // return { notSelected: true };
        }
      }
    } else {
      g.controls['read'].setErrors(null);
      return null;
    }
  }

  static FamilyanyOneSelected(g: FormGroup) {
    if ((g.get('dob') && g.get('dob')['value']) || (g.get('relationship') && g.get('relationship')['value']) || (g.get('occupation') && g.get('occupation')['value'])) {
      if ((g.get('dob')['value']) || (g.get('relationship')['value'] && g.get('relationship')['value'].length > 0) || (g.get('occupation')['value'] && g.get('occupation')['value'].length > 0)) {
        if (!g.controls['names']['value'] || (g.controls['names']['value'].length < 1 || g.controls['names']['value'] == '' || g.controls['names']['value'] == null || g.controls['names']['value'] == undefined)) {
          return g.controls['names']['setErrors']({ Namerequired: true });
          // return { notSelected: true };
        } else {
          g.controls['names'].setErrors(null);
          return null;
        }
      } else {
        g.controls['names'].setErrors(null);
        return null;
      }
    } else {
      g.controls['names'].setErrors(null);
      return null;
    }
  }

  static WorkanyOneSelected(g: FormGroup) {
    if ((g.get('names') && g.get('names')['value']) || (g.get('dateFrom') && g.get('dateFrom')['value']) || (g.get('dateTo') && g.get('dateTo')['value']) || (g.get('position') && g.get('position')['value']) || (g.get('supervisor') && g.get('supervisor')['value']) || (g.get('gross') && g.get('gross')['value']) || (g.get('nature') && g.get('nature')['value']) || (g.get('leaving') && g.get('leaving')['value'])) {
      // if ((g.get('dob')['value']) || (g.get('relationship')['value'] && g.get('relationship')['value'].length > 0) || (g.get('occupation')['value'] && g.get('occupation')['value'].length > 0)) {
      //   if (!g.controls['names']['value'] || (g.controls['names']['value'].length < 1 || g.controls['names']['value'] == '' || g.controls['names']['value'] == null || g.controls['names']['value'] == undefined)) {
      //     return g.controls['names']['setErrors']({ Namerequired: true });
      //     // return { notSelected: true };
      //   } else {
      //     g.controls['names'].setErrors(null);
      //     return null;
      //   }
      // } else {
      //   g.controls['names'].setErrors(null);
      //   return null;
      // }
      if ((g.get('names') && g.get('names')['value']) && (g.get('dateFrom') && g.get('dateFrom')['value']) && (g.get('dateTo') && g.get('dateTo')['value']) && (g.get('position') && g.get('position')['value']) && (g.get('supervisor') && g.get('supervisor')['value']) && (g.get('gross') && g.get('gross')['value']) && (g.get('nature') && g.get('nature')['value']) && (g.get('leaving') && g.get('leaving')['value'])) {
      // return g.controls['names']['setErrors'](null),
      // g.controls['dateFrom']['setErrors'](null),
      // g.controls['dateTo']['setErrors'](null),
      // g.controls['position']['setErrors'](null),
      // g.controls['supervisor']['setErrors'](null),
      // g.controls['gross']['setErrors'](null),
      // g.controls['nature']['setErrors'](null),
      // g.controls['leaving']['setErrors'](null);
      return null;
      } else {
        // return g.controls['names']['setErrors']({ required: true }),
        // g.controls['dateFrom']['setErrors']({ required: true }),
        // g.controls['dateTo']['setErrors']({ required: true }),
        // g.controls['position']['setErrors']({ required: true }),
        // g.controls['supervisor']['setErrors']({ required: true }),
        // g.controls['gross']['setErrors']({ required: true }),
        // g.controls['nature']['setErrors']({ required: true }),
        // g.controls['leaving']['setErrors']({ required: true });
          return { notSelected: true };
      }
    } else {
      // return g.controls['names']['setErrors'](null),
      // g.controls['dateFrom']['setErrors'](null),
      // g.controls['dateTo']['setErrors'](null),
      // g.controls['position']['setErrors'](null),
      // g.controls['supervisor']['setErrors'](null),
      // g.controls['gross']['setErrors'](null),
      // g.controls['nature']['setErrors'](null),
      // g.controls['leaving']['setErrors'](null);
      return null;
    }
  }


}
