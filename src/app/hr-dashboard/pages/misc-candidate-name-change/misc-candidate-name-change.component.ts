import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-misc-candidate-name-change',
  templateUrl: './misc-candidate-name-change.component.html',
  styleUrls: ['./misc-candidate-name-change.component.scss']
})
export class MiscCandidateNameChangeComponent implements OnInit {


  candidateEmail = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.email()]);
  candidateName = new FormControl({value: null, disabled: true}, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum100()]);
  addedCollegesList: any;
  buttonLabel = true;
  miscCheckEmailSubscription: Subscription;
  selectedEmailIdDetails: any;
  miscChangeCandidateNameSubscription: Subscription;
  candidateViewDetails = {
    updated_name: '',
    email: '',
    old_name: ''
  };

  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private gv: GlobalValidatorService
  ) { }

  ngOnInit() {
  }

  candidateEmailSubmit(type: any) {
    if (type == 'Reset') {
     this.candidateName.disable();
     this.candidateEmail.enable();
     return this.candidateName.reset();
    }
    this.candidateEmailCheck();
  }

  candidateEmailCheck() {
    const apiData = {
      email : this.candidateEmail.value.trim(),
    };
    this.miscCheckEmailSubscription = this.adminService.miscCheckEmail(apiData).subscribe((res: any)=> {
      this.candidateName.enable();
      this.candidateEmail.disable();
      this.selectedEmailIdDetails = res ? res : null;
      this.candidateName.patchValue(this.selectedEmailIdDetails?.field_user_name_value);
      this.candidateViewDetails.old_name = this.selectedEmailIdDetails?.field_user_name_value;
      this.candidateViewDetails.email = '';
    }, (err)=> {

    });
  }

  candidateUpdatedNameSubmit() {
    const apiData = {
      email: this.candidateEmail.value.trim(),
      user_name: this.candidateName.value
    };
    this.miscChangeCandidateNameSubscription = this.adminService.miscChangeCandidateName(apiData).subscribe((res: any)=> {
      this.appConfig.success('Candidate Name Updated Successfully');
      this.candidateViewDetails.email = apiData.email;
      this.candidateViewDetails.updated_name = apiData.user_name;
      this.candidateName.reset();
      this.candidateEmail.reset();
      this.selectedEmailIdDetails = null;
      this.buttonLabel = !this.buttonLabel;
      this.candidateEmail.enable();
      this.candidateName.disable();
    }, (err)=> {

    });
  }

}
