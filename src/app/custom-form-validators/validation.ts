'use strict';
import { Validators } from '@angular/forms';

export const textVal: any = [
    Validators.pattern(/^(.|\s)*\S(.|\s)*$/),
    Validators.required
];
