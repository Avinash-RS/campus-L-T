'use strict';
import { Validators } from '@angular/forms';
const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
const alphaNumericMaxLength30: RegExp = /^([a-zA-Z0-9_ ]){0,30}$/;
const alphaWithDot: RegExp = /^[a-zA-Z \.]*$/;

export const textVal: any = [
  Validators.pattern(/^(.|\s)*\S(.|\s)*$/),
  Validators.required,
  Validators.pattern(alphaNumericMaxLength),
];

export const req: any = Validators.required;

export const alphaNum255: any = Validators.pattern(alphaNumericMaxLength);

export const alphaNum30: any = Validators.pattern(alphaNumericMaxLength30);

export const alphaWithDots: any = Validators.pattern(alphaWithDot);
