'use strict';
import { Validators } from '@angular/forms';
const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
const alphaNumericMaxLength30: RegExp = /^([a-zA-Z0-9_ ]){0,30}$/;
const alphaWithDot: RegExp = /^[a-zA-Z \.]*$/;
const specialCharacterValidation = "^[a-zA-Z0-9 ]*";
// const alphaNumericwithCommonSpecialCharactersMaxLength255: RegExp = /^([a-zA-Z0-9_ \-,.();/\r\n|\r|\n/]){0,255}$/;
const alphaNumericwithCommonSpecialCharactersMaxLength255: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,255}$/;
const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,30}$/;
const alphaNumericwithCommonSpecialCharacters: RegExp = /^([a-zA-Z0-9_ \-,.\r\n])*$/;
const alphaNumericwithSpecialCharacters: RegExp = /^([a-zA-Z0-9_ \-,.:+#*&/\r\n|\r|\n/]){0,255}$/;

export const textVal: any = [
  Validators.pattern(/^(.|\s)*\S(.|\s)*$/),
  Validators.required,
  Validators.pattern(alphaNumericMaxLength),
];

export const req: any = Validators.required;

export const alphaNum255: any = Validators.pattern(alphaNumericwithCommonSpecialCharactersMaxLength255);

export const alphaNum30: any = Validators.pattern(alphaNumericwithCommonSpecialCharactersMaxLength30);

export const alphaWithDots: any = Validators.pattern(alphaNumericwithCommonSpecialCharacters);

export const alphaNum: any = Validators.pattern(alphaNumericwithCommonSpecialCharacters);

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const alphaNumericSpecialCharacters: any = Validators.pattern(alphaNumericwithSpecialCharacters);
