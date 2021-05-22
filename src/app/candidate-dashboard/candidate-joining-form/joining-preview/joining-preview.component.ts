import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component

@Component({
  selector: 'app-joining-preview',
  templateUrl: './joining-preview.component.html',
  styleUrls: ['./joining-preview.component.scss']
})
export class JoiningPreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;

  checkFormValidRequest: Subscription;
    // Title Dropdown list
    bloodGroupDropdownList: any;

    // Gender DropDown List 
    genderDropdownList = [
      {
        label: 'Male',
        value: 'Male'
      },
      {
        label: 'Female',
        value: 'Female'
      }
    ]
    // Form control name declaration Start
    form_candidate_id = 'candidate_id';
    form_title = 'title';
    form_name = 'name';
    form_dob = 'dob';
    form_gender = 'gender';
    form_place_of_birth = 'place_of_birth';
    form_state_of_birth = 'state_of_birth';
    form_nationality = 'nationality';
    form_mother_tongue = 'mother_tongue';
    form_religion = 'religion';
    form_caste = 'caste';
    form_blood_group = 'blood_group';
    form_father_name = 'father_name';
    form_emergency_contact = 'emergency_contact_no';
    form_mobile = 'mobile';
    form_email = 'email';
    form_aadhar = 'aadharno';
    form_pan = 'pan_no';
    form_offer_reference = 'offer_reference';
    form_offer_date = 'offer_date';
    form_height = 'height';
    form_weight = 'weight';
    form_identification_mark1 = 'identification_mark1';
    form_identification_mark2 = 'identification_mark2';
  // Form control name declaration end
  
  form_present_address_1 = 'present_line_street_addres';
  form_present_address_2 = 'present_line2_street_addre';
  form_present_address_3 = 'present_address_line_3';
  form_present_city = 'preset_city';
  form_present_state = 'present_state';
  form_present_zip_code = 'present_zip';
  form_present_region = 'present_country';
  form_same_as_checkbox = 'same_as_checkbox';
  form_permanent_address_1 = 'permanent_line1_street_add';
  form_permanent_address_2 = 'permanent_line2_street_add';
  form_permanent_address_3 = 'permanent_address_line_3';
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  form_permanent_zip_code = 'permanent_zip';
  form_permanent_region = 'permanent_country';

  // Dependent
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_relationship = 'relationship';
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_isDependent = 'dependent'

  // Education
  form_qualification_type = 'level';
  form_qualification = 'specification';
  form_specialization = 'discipline';
  form_collegeName = 'institute';
  form_boardUniversity = 'board_university';
  form_startDate = 'start_date';
  form_endDate = 'end_date';
  form_yearpassing = 'year_of_passing';
  form_backlog = 'backlogs';
  form_mode = 'mode';
  form_cgpa = 'percentage';

    personalDetails: any;
    personalDetailsMap: any;
    contactDetails: any;
    contactDetailsMap: any;
    dependentDetails: any;
    dependentDetailsMap: any;
    educationDetails: any;
    educationDetailsMap: any;

    getAllStates: any;
    url: any;
    nonMergedPersonalDetails: any;
  allPresentCityList: any;
  allPermanentCityList: any;
  formSubmitted: boolean;
  
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private glovbal_validators: GlobalValidatorService
  ) { 
  }

  ngOnInit() {
    this.checkFormSubmitted();
    this.getStateAPI();
    this.checkFormValidRequestFromRxjs();
  }

  checkFormSubmitted() {
    this.formSubmitted = this.appConfig.getLocalData('submit') && this.appConfig.getLocalData('submit') == '1' ? true : false;
  }
  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('preview');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getStateAPI() {
    this.appConfig.showLoader();
    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.getAllStates = data[0];
      this.getBloodGroup();   
    }, (err) => {

    });
  }

  getBloodGroup() {
    this.candidateService.getBloodGroups().subscribe((data: any) => {
      this.bloodGroupDropdownList = data;
      this.getPreviewData();
    }, (err) => {

    });
  }

  dateConvertion(date) {
    if (date) {      
      const split = moment(date).format('DD MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
     return split == 'Invalid date' ? null : split;
    }
  }

  dateConvertionMonth(date) {
    if (date) {      
      const split = moment(date).format('MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
     return split == 'Invalid date' ? null : split;
    }
  }
  

  getPreviewData() {
    this.candidateService.joiningFormGetPreviewDetails().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      this.personalDetails = data && data.personal ? data.personal : null;
      this.patchPersonalForm();
      this.contactDetails = data && data.contact ? data.contact : null;
      this.patchContactForm();
      this.dependentDetails = data && data.dependent && data.dependent.length > 0 ? data.dependent : [];
      if (this.dependentDetails.length > 0) {
        this.patchDependent();
      } else {
        this.dependentDetailsMap = [];
      }
      this.educationDetails = data && data.education && data.education.length > 0 ? data.education : [];
      if (this.educationDetails.length > 0) {
        this.patchEducation();
      } else {
        this.educationDetailsMap = [];
      }
    });
  }

  patchEducation() {
    this.educationDetailsMap = [];
    this.educationDetails.forEach(element => {
      if (element) {
        if (element[this.form_qualification_type] == 'SSLC') {
          element[this.form_qualification_type]  = element[this.form_qualification_type] ? 'SSLC/10th' : 'NA';
        }
        if (element[this.form_qualification_type] == 'HSC') {
          element[this.form_qualification_type]  = element[this.form_qualification_type] ? 'HSC/12th' : 'NA';
        }        
        if (element[this.form_qualification_type] == 'UG') {
          element[this.form_qualification_type]  = element[this.form_qualification_type] ? 'Undergraduate' : 'NA';
        }
        if (element[this.form_qualification_type] == 'PG') {
          element[this.form_qualification_type]  = element[this.form_qualification_type] ? 'Postgraduate' : 'NA';
        }
        
        element[this.form_qualification_type]  = element?.[this.form_qualification_type] ? element?.[this.form_qualification_type] : 'NA';
        element[this.form_qualification] = element?.[this.form_qualification] ? element?.[this.form_qualification] : 'NA';
        element[this.form_boardUniversity] = element?.[this.form_boardUniversity] ? element?.[this.form_boardUniversity] : 'NA';
        element[this.form_collegeName] = element?.[this.form_collegeName] ? element?.[this.form_collegeName] : 'NA';
        element[this.form_specialization] = element?.[this.form_specialization] ? element?.[this.form_specialization] : 'NA';
        element[this.form_cgpa] = element?.[this.form_cgpa] ? element?.[this.form_cgpa] : 'NA';
        element[this.form_backlog] = element?.[this.form_backlog] ? element?.[this.form_backlog] : 'NA';
        element[this.form_startDate] = element[this.form_startDate] ? this.dateConvertion(element[this.form_startDate]) : 'NA';
        element[this.form_endDate] = element[this.form_endDate] ? this.dateConvertion(element[this.form_endDate]) : 'NA';
        element[this.form_yearpassing] = element[this.form_yearpassing] ? this.dateConvertionMonth(element[this.form_yearpassing]) : 'NA';
        element[this.form_mode] = element[this.form_mode] == 'fulltime' ? 'Full time' : element[this.form_mode] == 'parttime' ? 'Part-time' : 'NA';
        this.educationDetailsMap.push(element);
      }
    });
  }

  patchDependent() {
    this.dependentDetailsMap = [];
    this.dependentDetails.forEach(element => {
      if (element) {
        element[this.form_dependent_dob] = element?.[this.form_dependent_dob] ? this.dateConvertion(element[this.form_dependent_dob]) : 'NA';
        element[this.form_dependent_differently_abled] = element?.[this.form_dependent_differently_abled] == '1' ? 'Yes' : element[this.form_dependent_differently_abled] == '0' ? 'No' : 'NA';
        element[this.form_dependent_status] = element?.[this.form_dependent_status] == '1' ? 'Active' : element[this.form_dependent_status] == '0' ? 'Inactive' : 'NA';
        element[this.form_isDependent] = element?.[this.form_isDependent] == '1' ? 'Yes' : element[this.form_isDependent] == '0' ? 'No' : 'NA';
        element[this.form_dependent_occupation] = element?.[this.form_dependent_occupation] ? element[this.form_dependent_occupation] : 'NA';
        this.dependentDetailsMap.push(element);
      }
    });
  }

  getAllPresentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;
    this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;
      this.appConfig.hideLoader();
      this.allPresentCityList = datas[0];
      this.allPresentCityList.forEach(element => {
        if (element.id == cityId) {
          city = element.name;
        }
      });
      callback(city);
    }, (err) => {
      callback(null);
    });
  }

  getAllPermanentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;
    this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;
      this.appConfig.hideLoader();
      this.allPermanentCityList = datas[0];
      this.allPermanentCityList.forEach(element => {
        if (element.id == cityId) {
          city = element.name;
        }
      });
      callback(city);
    }, (err) => {
      callback(null);
    });
  }


  patchContactForm() {
    let presentState: any;
    let permanentState: any;
    let presentCity: any;
    let permanentCity: any;
    if (this.getAllStates) {
      this.getAllStates.forEach(element => {
        if (element.id == this.contactDetails[this.form_present_state]) {
          presentState = element.name;
          this.getAllPresentCities(element.id, this.contactDetails[this.form_present_city], (callback)=> {
            presentCity = callback ? callback : 'NA';
            this.contactDetailsMap[this.form_present_city] = callback ? callback : 'NA';
          });
        }
      });
      this.getAllStates.forEach(element => {
        if (element.id == this.contactDetails[this.form_permanent_state]) {
          permanentState = element.name;
          this.getAllPermanentCities(element.id, this.contactDetails[this.form_permanent_city], (callback)=> {
            permanentCity = callback ? callback : 'NA';
          this.contactDetailsMap[this.form_permanent_city] = callback ? callback : 'NA';
          });
        }
      });
    }  
   const data = {
      [this.form_present_address_1]: this.contactDetails?.[this.form_present_address_1] ? this.contactDetails[this.form_present_address_1] : 'NA',
      [this.form_present_address_2]: this.contactDetails?.[this.form_present_address_2] ? this.contactDetails[this.form_present_address_2] : 'NA',
      [this.form_present_address_3]: this.contactDetails?.[this.form_present_address_3] ? this.contactDetails[this.form_present_address_3] : 'NA',
      [this.form_present_city]: presentCity ? presentCity : 'NA',
      [this.form_present_state]: presentState ? presentState : 'NA',
      [this.form_present_region]: this.contactDetails?.[this.form_present_region] ? 'India' : 'NA',
      [this.form_present_zip_code]: this.contactDetails?.[this.form_present_zip_code] ? this.contactDetails[this.form_present_zip_code] : 'NA',
      [this.form_same_as_checkbox]: this.contactDetails?.[this.form_same_as_checkbox] ? this.contactDetails[this.form_same_as_checkbox] : false,
      [this.form_permanent_address_1]: this.contactDetails?.[this.form_permanent_address_1] ? this.contactDetails[this.form_permanent_address_1] : 'NA',
      [this.form_permanent_address_2]: this.contactDetails?.[this.form_permanent_address_2] ? this.contactDetails[this.form_permanent_address_2] : 'NA',
      [this.form_permanent_address_3]: this.contactDetails?.[this.form_permanent_address_3] ? this.contactDetails[this.form_permanent_address_3] : 'NA',
      [this.form_permanent_city]: permanentCity ? permanentCity : 'NA',
      [this.form_permanent_state]: permanentState ? permanentState : 'NA',
      [this.form_permanent_region]: this.contactDetails?.[this.form_permanent_region] ? 'India' : 'NA',
      [this.form_permanent_zip_code]: this.contactDetails?.[this.form_permanent_zip_code] ? this.contactDetails[this.form_permanent_zip_code] : 'NA'
    };
    this.contactDetailsMap = data;
    this.contactDetailsMap.presentAddress = `${this.contactDetails?.[this.form_present_address_1]}, ${this.contactDetails?.[this.form_present_address_2]}, ${this.contactDetails?.[this.form_present_address_3]}`;
    this.contactDetailsMap.permanentAddress = `${this.contactDetails?.[this.form_permanent_address_1]}, ${this.contactDetails?.[this.form_permanent_address_2]}, ${this.contactDetails?.[this.form_permanent_address_3]}`;
    
  }

  patchPersonalForm() {
    let stateOfBirth: any;
    let bloodGroup: any;
    if (this.getAllStates && this.bloodGroupDropdownList) {
    this.getAllStates.forEach(element => {
      if (element.id == this.personalDetails[this.form_state_of_birth]) {
        stateOfBirth = element.name;
      }
    });
    this.bloodGroupDropdownList.forEach(element => {
      if (element.bloodgroup_id == this.personalDetails[this.form_blood_group]) {
        bloodGroup = element.bloodgroup_name;
      }
    });
  }
    const data = {
      // [this.form_title]: this.personalDetails[this.form_title], 
      [this.form_name]: this.personalDetails?.[this.form_name] ? this.personalDetails[this.form_name] : 'NA', 
      [this.form_dob]: this.personalDetails?.[this.form_dob] ? this.dateConvertion(this.personalDetails[this.form_dob]) : 'NA', 
      [this.form_gender]: this.personalDetails?.[this.form_gender] ? this.personalDetails[this.form_gender] : 'NA', 
      [this.form_place_of_birth]: this.personalDetails?.[this.form_place_of_birth] ? this.personalDetails[this.form_place_of_birth] : 'NA', 
      [this.form_state_of_birth]: stateOfBirth ? stateOfBirth : 'NA', 
      [this.form_nationality]: this.personalDetails?.[this.form_nationality] ? this.personalDetails[this.form_nationality] : 'NA', 
      [this.form_mother_tongue]: this.personalDetails?.[this.form_mother_tongue] ? this.personalDetails[this.form_mother_tongue] : 'NA', 
      [this.form_religion]: this.personalDetails?.[this.form_religion] ? this.personalDetails[this.form_religion] : 'NA', 
      [this.form_caste]: this.personalDetails?.[this.form_caste] ? this.personalDetails[this.form_caste] : 'NA', 
      [this.form_blood_group]: bloodGroup ? bloodGroup : 'NA',
      [this.form_father_name]: this.personalDetails?.[this.form_father_name] ? this.personalDetails[this.form_father_name] : 'NA', 
      [this.form_emergency_contact]: this.personalDetails?.[this.form_emergency_contact] ? this.personalDetails[this.form_emergency_contact] : 'NA', 
      [this.form_mobile]: this.personalDetails?.[this.form_mobile] ? this.personalDetails[this.form_mobile] : 'NA', 
      [this.form_email]: this.personalDetails?.[this.form_email] ? this.personalDetails[this.form_email] : 'NA', 
      [this.form_aadhar]: this.personalDetails?.[this.form_aadhar] ? this.personalDetails[this.form_aadhar] : 'NA', 
      [this.form_pan]: this.personalDetails?.[this.form_pan] ? this.personalDetails[this.form_pan] : 'NA', 
      [this.form_offer_reference]: this.personalDetails?.[this.form_offer_reference] ? this.personalDetails[this.form_offer_reference] : 'NA', 
      [this.form_offer_date]: this.personalDetails?.[this.form_offer_date] ? this.dateConvertion(this.personalDetails[this.form_offer_date]) : 'NA',
      [this.form_height]: this.personalDetails?.[this.form_height] ? this.personalDetails[this.form_height] : 'NA', 
      [this.form_weight]: this.personalDetails?.[this.form_weight] ? this.personalDetails[this.form_weight] : 'NA', 
      [this.form_identification_mark1]: this.personalDetails?.[this.form_identification_mark1] ? this.personalDetails[this.form_identification_mark1] : 'NA', 
      [this.form_identification_mark2]: this.personalDetails?.[this.form_identification_mark2] ? this.personalDetails[this.form_identification_mark2] : 'NA',
    };
    this.url = this.personalDetails?.profile_image;
    this.personalDetailsMap = data;
  }


  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'preview') {
          return this.appConfig.routeNavigation(data.goto);
      } 
    });
  }

  matDialogOpen() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }

  closeDialog(e) {
    if (e == 'save') {
      this.dialog.closeAll();
      this.formSubmit();
    } else {
      this.dialog.closeAll();
    }
  }


  formSubmit(routeValue?: any) {
        this.candidateService.joiningFormSubmit().subscribe((data: any)=> {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('success', 'Saved', 'Congrats, Form has been successfully submitted');
          this.sharedService.joiningFormStepperStatus.next();
          return this.appConfig.routeNavigation(routeValue ? routeValue : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_SUBMIT);    
      });
  }

  editRoute(route) {
    if (route == 'personal') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
    }
    if (route == 'contact') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);      
    }
    if (route == 'dependent') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);      
    }
    if (route == 'education') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);      
    }
    if (route == 'upload') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);      
    }
  }

  routeNext(route) {
    // if (!this.personalForm.dirty) {
      // if(this.appConfig.getLocalData('preview') == '1') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
      // }
      // } else {
      //   if(this.personalForm.valid) {
      //     return this.sharedService.openJoiningRoutePopUp.next(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
      //   }
      //   this.glovbal_validators.validateAllFields(this.personalForm);
      //   this.ngAfterViewInit();
      //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');    
      // }
    // } else {
    //   this.glovbal_validators.validateAllFields(this.personalForm);
    //   this.ngAfterViewInit();
    //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    //   }
    }


  ngOnDestroy() {
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }
}
