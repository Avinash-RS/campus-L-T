import { NgForm } from '@angular/forms';
import { ComponentCanDeactivate } from '../component-canDeactivate/component-canDeactivate';

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;

  canDeactivate(): boolean {
    console.log('ad', this.form);
    return this.form.submitted || !this.form.dirty;
  }
}
