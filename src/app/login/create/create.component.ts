import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]]
    });
  }

  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  get confirmpassword() {
    return this.createForm.get('confirmpassword');
  }

  submit() {
    console.log(this.createForm.value);
    
  }

}
