import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormCustomValidators } from '../../custom-form-validators/autocompleteDropdownMatch';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit {

  cities: any[] = [
    {
      id: '1',
      name: 'Chennai'
    },
    {
      id: '2',
      name: 'Madurai'
    },
    {
      id: '3',
      name: 'Coimbatore'
    },
    {
      id: '4',
      name: 'Trichy'
    }
  ];
  states: any[] = [
    {
      id: '1',
      name: 'Tamilnadu'
    },
    {
      id: '2',
      name: 'Andhra Pradesh'
    },
    {
      id: '3',
      name: 'Karnataka'
    },
    {
      id: '4',
      name: 'Kerala'
    }
  ];
  filteredCities: Observable<string[]>;
  filteredStates: Observable<any[]>;
  openDrop = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService
  ) { }

  ngOnInit() {
    this.FormRegister();
    this.autocomplete();

    // Rest API subscribe methods
    // this.dummyHTTP();
    // this.dummyFETCH();
  }

  // dummyHTTP() {
  //   this.apiService.httpAPI().subscribe((data: any) => {
  //     console.log(data);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
  // dummyFETCH() {
  //   this.apiService.fetchAPI();
  // }

  autocomplete() {
    // tslint:disable-next-line: no-non-null-assertion
    this.filteredCities = this.registerForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name, this.cities) : this.cities.slice())
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.filteredStates = this.registerForm.get('state')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name, this.states) : this.states.slice())
    );

  }

  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  openDropdown(event, trigger: MatAutocompleteTrigger) {
    if (trigger.panelOpen) {
      event.stopPropagation();
      trigger.closePanel();
    } else {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  FormRegister() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      corporateName: ['', [Validators.required]],
      corporateEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
      state: ['', [Validators.required, FormCustomValidators.valueSelected(this.states)]],
      city: ['', [Validators.required, FormCustomValidators.valueSelected(this.cities)]],
      comment: ['']
    });
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get jobTitle() {
    return this.registerForm.get('jobTitle');
  }
  get mobileNumber() {
    return this.registerForm.get('mobileNumber');
  }
  get corporateName() {
    return this.registerForm.get('corporateName');
  }
  get corporateEmail() {
    return this.registerForm.get('corporateEmail');
  }
  get state() {
    return this.registerForm.get('state');
  }
  get city() {
    return this.registerForm.get('city');
  }
  get comment() {
    return this.registerForm.get('comment');
  }

  onSubmit(val) {
    // console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      // API
      const datas = {
        name: [{ value: this.registerForm.value.firstName }],
        mail: [{ value: this.registerForm.value.corporateEmail }],
        roles: [{ target_id: 'institute' }],
        field_first_name: [{ value: this.registerForm.value.firstName }],
        field_lname: [{ value: this.registerForm.value.lastName }],
        field_job_title: [{ value: this.registerForm.value.jobTitle }],
        field_mobile_number: [{ value: this.registerForm.value.mobileNumber }],
        field_institute_name: [{ value: this.registerForm.value.corporateName }],
        field_institute_email: [{ value: this.registerForm.value.corporateEmail }],
        field_state: [{ value: "tamilnadu" }],
        field_city: [{ value: "chennai" }],
        field_comments: [{ value: "Hi this is for testing purpose" }]
      };

      this.apiService.httpAPI(datas).subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/signup/otp']);
      }, (error) => {
        console.log(error);
      });

    } else {
      this.validateAllFields(this.registerForm);
    }
  }


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }
}
