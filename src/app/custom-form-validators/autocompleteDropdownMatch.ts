import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormCustomValidators {
    static valueSelected(myArray: any[]): ValidatorFn {

        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const selectboxValue = c.value.name;
            const pickedOrNot = myArray.filter(alias => alias.name === selectboxValue);

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
            const passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm;
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
}
