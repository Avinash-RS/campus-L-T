import { NgForm } from '@angular/forms';
import { ComponentCanDeactivate } from '../component-canDeactivate/component-canDeactivate';

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;
  abstract get form1(): NgForm;
  abstract get form2(): NgForm;
  abstract get form3(): NgForm;
  abstract get form4(): NgForm;
  abstract get form5(): NgForm;

  canDeactivate(): boolean {
    console.log('form', this.form);
    console.log('form1', this.form1);
    console.log('form2', this.form2);
    console.log('form3', this.form3);
    console.log('form4', this.form4);
    console.log('form5', this.form5);
    if (this.form) {
      return this.form.submitted || !this.form.dirty;
    }
    if (this.form1) {
      return this.form1.submitted || !this.form1.dirty;
    }
    if (this.form2) {
      return this.form2.submitted || !this.form2.dirty;
    }
    if (this.form3) {
      return this.form3.submitted || !this.form3.dirty;
    }
    if (this.form4) {
      return this.form4.submitted || !this.form4.dirty;
    }
    if (this.form5) {
      return this.form5.submitted || !this.form5.dirty;
    }
  }
}
