import { Directive } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';

export const FORMAT = {
  parse: {
      dateInput: 'YYYY',
  },
  display: {
      dateInput: 'YYYY',
      monthYearLabel: 'YYYY',
      monthYearA11yLabel: 'YYYY',
  },
};  

@Directive({
  selector: '[appYearOnly]',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT },
  ]
})
export class YearOnlyDirective {

  constructor() { }

}
