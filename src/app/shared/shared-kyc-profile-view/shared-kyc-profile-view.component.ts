import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ModalBoxComponent } from '../modal-box/modal-box.component';

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

@Component({
  selector: 'app-shared-kyc-profile-view',
  templateUrl: './shared-kyc-profile-view.component.html',
  styleUrls: ['./shared-kyc-profile-view.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class SharedKycProfileViewComponent implements OnInit, AfterViewInit {

  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('matDialogTerms', { static: false }) matDialogRefTerms: TemplateRef<any>;
  @ViewChild('matDialogBGV', { static: false }) matDialogRefBGV: TemplateRef<any>;
  @ViewChild('matDialogCaste', { static: false }) matDialogRefCaste: TemplateRef<any>;
  @ViewChild('matDialogCoc', { static: false }) matDialogRefCoc: TemplateRef<any>;
  @ViewChild('matDialogJoin', { static: false }) matDialogRefJoin: TemplateRef<any>;
  @ViewChild('matDialogDocViewer', { static: false }) matDialogRefDocViewer: TemplateRef<any>;
  @Input() data;
  category = [
    {
      name: 'Scheduled Caste',
      caste: 'SC'
    },
    {
      name: 'Scheduled Tribe',
      caste: 'ST'
    },
    {
      name: 'De-notified Tribe',
      caste: 'DenotifiedTribe'
    },
    {
      name: 'Nomadic Tribe',
      caste: 'NomadicTribe'
    },
    {
      name: 'Special Backward Category',
      caste: 'SBC'
    },
    {
      name: 'Other Backward Classes',
      caste: 'OBC'
    },
    {
      name: 'General / Open Category',
      caste: 'GEN'
    },
    {
      name: 'Other',
      caste: 'Other'
    },
  ];

  minDate: Date;
  maxDate: Date;

  showSizeError = {
    image: false,
    size: false,
    maxsize: '',
    minsize: ''
  };
  signature = {
    name: null,
    file_id: null,
    file_path: null,
    file_size: null,
    filename: null,
    filetype: null,
    label: null
  };

  selectedImage: any;
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
  form_category = 'category';
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
  form_emergency_contact_name = 'emergency_contact_name';
  form_emergency_contact_relation = 'emergency_contact_relation';
  form_personal_email = 'personal_email';
  form_marital_status = 'marital_status';
  form_domicile_state = 'domicile_state';
  form_no_of_children = 'no_of_children';

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
  form_finalcgpa = 'final_percentage';

  // Upload
  form_file_id = 'file_id';
  form_id = 'id';
  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_name_document = 'name';
  form_label = 'label';
  form_description = 'description';
  form_Not_Submitted_Description = 'not_submitted_description';
  form_expectedDate = 'expected_date';
  form_semesterArray = 'sub_documents';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'Education_Level';
  form_bankArray = 'bank';
  form_acc_no = 'account_no';
  form_ifsc_code = 'ifsc_code';
  form_branch = 'branch';

  pdfsrc: any;

  // Acknowledgements
  acknowledgmentForm: FormGroup;
  form_bgv = 'bgv';
  form_caste_preview = 'caste';
  form_coc = 'coc';
  form_joining = 'joining';
  form_terms_conditions = 'terms_conditions';
  form_ack_place = 'ack_place';
  form_ack_date = 'ack_date';

  // Work details
  //form Variables
  form_workDetails = "workDetails";
  form_total_exp_years = "total_exp_years";
  form_total_exp_months = "total_exp_months";
  form_break_in_emp = "break_in_emp";
  form_employed_us = "employed_us";
  form_oc = "oc";
  form_payslip = "payslip";
  form_interviewed_by_us = "interviewed_by_us";
  form_post = "post";
  form_when_interview = "when_interview"
  form_employment_name_address = "employment_name_address";
  form_duration_from = "duration_from";
  form_duration_to = "duration_to";
  form_duration_year = "duration_year";
  form_duration_month = "duration_month";
  form_postion_field = "postion_field";
  form_name_designation_supervisor = "name_designation_supervisor";
  form_nature_work = "nature_work";
  form_gross_emploment = "gross_emploment";
  form_reason_leaving = "reason_leaving";
  form_hr_name = 'hr_name';
  form_hr_contact_no = 'hr_contact_no';
  form_hr_email = 'hr_email';
  form_bgvDetails = "bgvDetails";
  form_convicted_by_Court = "convicted_by_Court";
  form_arrested = "arrested";
  form_prosecuted = "prosecuted";
  form_detention = "detention";
  form_fined_by_court = "fined_by_court";
  form_debarred_exam_university = "debarred_exam_university";
  form_debarred_psc_company = "debarred_psc_company";
  form_court_case_pending = "court_case_pending";
  form_university_case_pending = "university_case_pending";
  form_disciplinary_proceedings = "disciplinary_proceedings";
  form_full_particulars = "full_particulars"

  form_Employment_Array = "Employment"


  personalDetails: any;
  personalDetailsMap: any;
  contactDetails: any;
  contactDetailsMap: any;
  dependentDetails: any;
  dependentDetailsMap: any;
  educationDetails: any;
  educationDetailsMap: any;
  workDetails: any;
  workDetailsMap: any;

  getAllStates: any;
  url: any;
  nonMergedPersonalDetails: any;
  allPresentCityList: any;
  allPermanentCityList: any;
  formSubmitted: boolean;
  documentDetails: any;
  actualDate: any;
  noShowWork: boolean;
  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private dialog: MatDialog,
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.checkFormSubmitted();
    this.getStateAPI();
  }

  checkAnyDocuments() {
    if (this.documentDetails) {
      if ((this.documentDetails.Resume && this.documentDetails.Resume.length > 0) ||
      (this.documentDetails.Education_Documents && this.documentDetails.Education_Documents.length > 0) ||
      (this.documentDetails.Certifications && this.documentDetails.Certifications.length > 0) ||
      (this.documentDetails.Other_Certifications && this.documentDetails.Other_Certifications.length > 0) ||
      (this.documentDetails.Joining_Details && this.documentDetails.Joining_Details.length > 0) ||
      (this.documentDetails.Banking_Details && this.documentDetails.Banking_Details.length > 0) ||
      (this.documentDetails.Transfer_Certificate && this.documentDetails.Transfer_Certificate.length > 0)
      ) {
        return true;
      } else
      return false;
    } else {
      return false;
    }
  }

  getPreviewData() {
    let uid = this.data.candidateId;
    this.candidateService.joiningFormGetPreviewDetailsCommon(uid).subscribe((data: any) => {

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
      // Documents mapping
      this.documentDetails = data && data.documents ? data.documents : null;
      if (this.documentDetails) {
        let joinCheck = [];
        let Banking_Details = [];
        let Resume = [];
        let Transfer_Certificate = [];
        let Education_Documents = [];
        if (this.documentDetails.Joining_Details) {
          this.documentDetails.Joining_Details.forEach(element => {
            if (element) {
              joinCheck.push(element);
            }
          });
        }
        if (this.documentDetails.Banking_Details) {
          this.documentDetails.Banking_Details.forEach(element => {
            if (element) {
              Banking_Details.push(element);
            }
          });
        }
        if (this.documentDetails.Resume) {
          this.documentDetails.Resume.forEach(element => {
            if (element) {
              Resume.push(element);
            }
          });
        }
        if (this.documentDetails.Transfer_Certificate) {
          this.documentDetails.Transfer_Certificate.forEach(element => {
            if (element) {
              Transfer_Certificate.push(element);
            }
          });
        }
        if (this.documentDetails.Education_Documents) {
          this.documentDetails.Education_Documents.forEach(element => {
            if (element && element.sub_documents) {
              Education_Documents.push(element);
            }
          });
        }
        this.documentDetails.Joining_Details = joinCheck;
        this.documentDetails.Banking_Details = Banking_Details;
        this.documentDetails.Resume = Resume;
        this.documentDetails.Transfer_Certificate = Transfer_Certificate;
        this.documentDetails.Education_Documents = Education_Documents;
      }

      // Work Experience
      this.getWorkApiDetails(data);


      if (data && data.acknowledgment) {
        let ackData = data.acknowledgment;
        let ack = {
          [this.form_bgv]: ackData.bgv && (ackData.bgv == '1' || ackData.bgv == true) ? false : false,
          [this.form_caste]: ackData.caste && (ackData.caste == '1' || ackData.caste == true) ? false : false,
          [this.form_coc]: ackData.coc && (ackData.coc == '1' || ackData.coc == true) ? false : false,
          [this.form_joining]: ackData.joining && (ackData.joining == '1' || ackData.joining == true) ? false : false,
          [this.form_terms_conditions]: ackData.terms_conditions && (ackData.terms_conditions == '1' || ackData.terms_conditions == true) ? false : false,
          [this.form_ack_place]: ackData.ack_place ? ackData.ack_place : null,
          [this.form_ack_date]: ackData.ack_date ? this.dateConvertionForm(new Date()) : this.dateConvertionForm(new Date()),
        }
        this.actualDate = ackData.ack_date;
      }
      if (data && data.signature) {
        let sign = data.signature;
        this.signature = {
          name: 'Signature',
          label: 'Signature',
          file_id: sign.file_id,
          file_path: sign.file_path,
          file_size: sign.file_size,
          filename: sign.filename,
          filetype: sign.filetype,
        }
      }
    });
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, 1);
    this.maxDate = new Date(currentYear + 1, 0, 0);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      return split;
    }
  }

  dateConvertionForm(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  checkFormSubmitted() {
    this.formSubmitted = true;
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getStateAPI() {

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
    if (this.appConfig.getLocalData('bloodgroup')) {
      this.bloodGroupDropdownList = JSON.parse(this.appConfig.getLocalData('bloodgroup'));
      this.getPreviewData();
    } else {
      this.candidateService.getBloodGroups().subscribe((data: any) => {
        this.bloodGroupDropdownList = data;
        this.bloodGroupDropdownList && this.bloodGroupDropdownList.length > 0 ? this.appConfig.setLocalData('bloodgroup', JSON.stringify(this.bloodGroupDropdownList)) : '';
        this.getPreviewData();
      }, (err) => {

      });
    }
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

  patchingCriminal() {
    let bgv;
    if (this.workDetails.bgvDetails) {
      let data = this.workDetails.bgvDetails;
      bgv = {
        [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] && data[this.form_convicted_by_Court] == '1' ? true : false,
        [this.form_arrested]: data[this.form_arrested] && data[this.form_arrested] == '1' ? true : false,
        [this.form_prosecuted]: data[this.form_prosecuted] && data[this.form_prosecuted] == '1' ? true : false,
        [this.form_detention]: data[this.form_detention] && data[this.form_detention] == '1' ? true : false,
        [this.form_fined_by_court]: data[this.form_fined_by_court] && data[this.form_fined_by_court] == '1' ? true : false,
        [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] && data[this.form_debarred_exam_university] == '1' ? true : false,
        [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] && data[this.form_debarred_psc_company] == '1' ? true : false,
        [this.form_court_case_pending]: data[this.form_court_case_pending] && data[this.form_court_case_pending] == '1' ? true : false,
        [this.form_university_case_pending]: data[this.form_university_case_pending] && data[this.form_university_case_pending] == '1' ? true : false,
        [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] && data[this.form_disciplinary_proceedings] == '1' ? true : false,
        [this.form_full_particulars]: data[this.form_full_particulars]
      }
    } else {
      bgv = {
        [this.form_convicted_by_Court]: null,
        [this.form_arrested]: null,
        [this.form_prosecuted]: null,
        [this.form_detention]: null,
        [this.form_fined_by_court]: null,
        [this.form_debarred_exam_university]: null,
        [this.form_debarred_psc_company]: null,
        [this.form_court_case_pending]: null,
        [this.form_university_case_pending]: null,
        [this.form_disciplinary_proceedings]: null,
        [this.form_full_particulars]: null
      }
    }

    if (
      bgv[this.form_convicted_by_Court] ||
      bgv[this.form_arrested] ||
      bgv[this.form_prosecuted] ||
      bgv[this.form_detention] ||
      bgv[this.form_fined_by_court] ||
      bgv[this.form_debarred_exam_university] ||
      bgv[this.form_debarred_psc_company] ||
      bgv[this.form_court_case_pending] ||
      bgv[this.form_university_case_pending] ||
      bgv[this.form_disciplinary_proceedings]) {
      bgv.show = true;
    } else {
      bgv.show = false;
    }
    this.workDetails.bgvDetails = bgv;
  }
  patchWorkDetails() {
    if (this.workDetails.Employment && this.workDetails.Employment.length > 0) {
      let experience = [];
      this.workDetails.Employment.forEach(element => {
        if (element && element[this.form_employment_name_address]) {
          experience.push(element);
        }
      });
      this.workDetails.Employment = experience;
    }
    if (this.workDetails.workDetails) {
      let work = this.workDetails.workDetails;
      work[this.form_break_in_emp] = work[this.form_break_in_emp] ? work[this.form_break_in_emp] : null;
      work[this.form_employed_us] = work[this.form_employed_us] == '1' ? true : false;
      work[this.form_interviewed_by_us] = work[this.form_interviewed_by_us] == '1' ? true : false;
      work[this.form_total_exp_months] = work[this.form_total_exp_months] ? Number(work[this.form_total_exp_months]) : 0;
      work[this.form_total_exp_years] = work[this.form_total_exp_years] ? Number(work[this.form_total_exp_years]) : 0;
      this.workDetails.workDetails = work;
    }
  }

  getWorkApiDetails(datas) {
    if (datas && datas['work_experience']) {
      let data = datas['work_experience'];
      let work = {
        workDetails: data && data.workDetails ? data.workDetails : null,
        Employment: data && data.Employment ? data.Employment : [],
        bgvDetails: data && data.bgvDetails ? data.bgvDetails : null
      }
      this.workDetails = work;
      this.patchWorkDetails();
      this.patchingCriminal();
      if ((work.workDetails && (work.workDetails.break_in_emp || work.workDetails.employed_us == '1' || work.workDetails.interviewed_by_us == '1' || work.workDetails.total_exp_months || work.workDetails.total_exp_years)) || (this.workDetails.bgvDetails && this.workDetails.bgvDetails.show) || (work.Employment && work.Employment.length > 0 && work.Employment[0] && work.Employment[0][this.form_employment_name_address] )) {
        this.noShowWork = false;
      } else {
        this.noShowWork = true;
      }
    } else {
      this.workDetails = null;
    }
}

  customEducationLabel(label) {
    if (label == 'SSLC') {
      return 'SSLC/10th';
    }
    if (label == 'HSC') {
      return 'HSC/12th';
    }
    if (label == 'UG') {
      return 'Undergraduate';
    }
    if (label == 'PG') {
      return 'Postgraduate';
    }
    return label;
  }

  patchEducation() {
    this.educationDetailsMap = [];
    this.educationDetails.forEach(element => {
      if (element) {
        if (element[this.form_qualification_type] == 'SSLC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'SSLC/10th' : 'NA';
        }
        if (element[this.form_qualification_type] == 'HSC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'HSC/12th' : 'NA';
        }
        if (element[this.form_qualification_type] == 'UG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Undergraduate' : 'NA';
        }
        if (element[this.form_qualification_type] == 'PG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Postgraduate' : 'NA';
        }

        element[this.form_qualification_type] = element?.[this.form_qualification_type] ? element?.[this.form_qualification_type] : 'NA';
        element[this.form_qualification] = element?.[this.form_qualification] ? element?.[this.form_qualification] : 'NA';
        element[this.form_boardUniversity] = element?.[this.form_boardUniversity] ? element?.[this.form_boardUniversity] : 'NA';
        element[this.form_collegeName] = element?.[this.form_collegeName] ? element?.[this.form_collegeName] : 'NA';
        element[this.form_specialization] = element?.[this.form_specialization] ? element?.[this.form_specialization] : 'NA';
        element[this.form_cgpa] = element?.[this.form_cgpa] ? element?.[this.form_cgpa] : 'NA';
        element[this.form_finalcgpa] = element?.[this.form_finalcgpa] ? element?.[this.form_finalcgpa] : 'NA';
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
          this.getAllPresentCities(element.id, this.contactDetails[this.form_present_city], (callback) => {
            presentCity = callback ? callback : 'NA';
            this.contactDetailsMap[this.form_present_city] = callback ? callback : 'NA';
          });
        }
      });
      this.getAllStates.forEach(element => {
        if (element.id == this.contactDetails[this.form_permanent_state]) {
          permanentState = element.name;
          this.getAllPermanentCities(element.id, this.contactDetails[this.form_permanent_city], (callback) => {
            permanentCity = callback ? callback : 'NA';
            this.contactDetailsMap[this.form_permanent_city] = callback ? callback : 'NA';
          });
        }
      });
    }
    const data = {
      [this.form_present_address_1]: this.contactDetails?.[this.form_present_address_1] ? this.contactDetails[this.form_present_address_1] : '',
      [this.form_present_address_2]: this.contactDetails?.[this.form_present_address_2] ? this.contactDetails[this.form_present_address_2] : '',
      [this.form_present_address_3]: this.contactDetails?.[this.form_present_address_3] ? this.contactDetails[this.form_present_address_3] : '',
      [this.form_present_city]: presentCity ? presentCity : 'NA',
      [this.form_present_state]: presentState ? presentState : 'NA',
      [this.form_present_region]: this.contactDetails?.[this.form_present_region] ? 'India' : 'India',
      [this.form_present_zip_code]: this.contactDetails?.[this.form_present_zip_code] ? this.contactDetails[this.form_present_zip_code] : 'NA',
      [this.form_same_as_checkbox]: this.contactDetails?.[this.form_same_as_checkbox] ? this.contactDetails[this.form_same_as_checkbox] : false,
      [this.form_permanent_address_1]: this.contactDetails?.[this.form_permanent_address_1] ? this.contactDetails[this.form_permanent_address_1] : '',
      [this.form_permanent_address_2]: this.contactDetails?.[this.form_permanent_address_2] ? this.contactDetails[this.form_permanent_address_2] : '',
      [this.form_permanent_address_3]: this.contactDetails?.[this.form_permanent_address_3] ? this.contactDetails[this.form_permanent_address_3] : '',
      [this.form_permanent_city]: permanentCity ? permanentCity : 'NA',
      [this.form_permanent_state]: permanentState ? permanentState : 'NA',
      [this.form_permanent_region]: this.contactDetails?.[this.form_permanent_region] ? 'India' : 'India',
      [this.form_permanent_zip_code]: this.contactDetails?.[this.form_permanent_zip_code] ? this.contactDetails[this.form_permanent_zip_code] : 'NA'
    };
    this.contactDetailsMap = data;
    this.contactDetailsMap.presentAddress = `${this.contactDetails?.[this.form_present_address_1] ? (this.contactDetails?.[this.form_present_address_1] + ',') : ''} ${this.contactDetails?.[this.form_present_address_2] ? this.contactDetails?.[this.form_present_address_2] : ''} ${this.contactDetails?.[this.form_present_address_3] ? (', ' + this.contactDetails?.[this.form_present_address_3]) : 'NA'}`;
    this.contactDetailsMap.permanentAddress = `${this.contactDetails?.[this.form_permanent_address_1] ? (this.contactDetails?.[this.form_permanent_address_1] + ',') : ''} ${this.contactDetails?.[this.form_permanent_address_2] ? this.contactDetails?.[this.form_permanent_address_2] : ''} ${this.contactDetails?.[this.form_permanent_address_3] ? (', ' + this.contactDetails?.[this.form_permanent_address_3]) : 'NA'}`;

  }

  isAddressPresent() {

  }
  patchPersonalForm() {
    let stateOfBirth: any;
    let bloodGroup: any;
    let category: any;
    let domicile: any;
    if (this.getAllStates && this.bloodGroupDropdownList) {
      this.getAllStates.forEach(element => {
        if (element.id == this.personalDetails[this.form_state_of_birth]) {
          stateOfBirth = element.name;
        }
        if (element.id == this.personalDetails[this.form_domicile_state]) {
          domicile = element.name;
        }
      });
      this.bloodGroupDropdownList.forEach(element => {
        if (element.bloodgroup_id == this.personalDetails[this.form_blood_group]) {
          bloodGroup = element.bloodgroup_name;
        }
      });
    }
    if (this.category && this.personalDetails[this.form_category]) {
      this.category.forEach(element => {
        if (element.caste == this.personalDetails[this.form_category]) {
          category = element.name;
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
      [this.form_category]: category ? category : 'NA',
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
      [this.form_emergency_contact_name]: this.personalDetails?.[this.form_emergency_contact_name] ? this.personalDetails[this.form_emergency_contact_name] : 'NA',
      [this.form_emergency_contact_relation]: this.personalDetails?.[this.form_emergency_contact_relation] ? this.personalDetails[this.form_emergency_contact_relation] : 'NA',
      [this.form_personal_email]: this.personalDetails?.[this.form_personal_email] ? this.personalDetails[this.form_personal_email] : 'NA',
      [this.form_marital_status]: this.personalDetails?.[this.form_marital_status] ? this.personalDetails[this.form_marital_status] : 'NA',
      [this.form_no_of_children]: this.personalDetails?.[this.form_no_of_children] ? this.personalDetails[this.form_no_of_children] : 'NA',
      [this.form_domicile_state]: domicile ? domicile : 'NA',
      [this.form_identification_mark1]: this.personalDetails?.[this.form_identification_mark1] ? this.personalDetails[this.form_identification_mark1] : 'NA',
      [this.form_identification_mark2]: this.personalDetails?.[this.form_identification_mark2] ? this.personalDetails[this.form_identification_mark2] : 'NA',
    };
    this.url = this.personalDetails?.profile_image;
    this.personalDetailsMap = data;
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
    } else {
      this.dialog.closeAll();
    }
  }

  matDialogOpenTerms(type) {
    let name;
    if (type == 'terms') {
      name = this.matDialogRefTerms;
    }
    if (type == 'bgv') {
      name = this.matDialogRefBGV;
    }
    if (type == 'coc') {
      name = this.matDialogRefCoc;
    }
    if (type == 'caste') {
      name = this.matDialogRefCaste;
    }
    if (type == 'join') {
      name = this.matDialogRefJoin;
    }

    const dialogRef = this.dialog.open(name, {
      width: '890px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'wrapper-kyc-terms'
    });
  }

  kycTerms() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Bulk Upload helper video',
        componentData: '',
        type: 'kyc-terms',
        identity: 'kyc-terms'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.appConfig.terms(ModalBoxComponent, data);
  }

  openMatDialog(src, type) {
    if (!type.includes('application/pdf')) {
      return window.open(src, '_blank');
    }
    this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matDialogRefDocViewer, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForPDFViewer'
    });
  }
  closeBox() {
    this.dialog.closeAll();
  }

  //Form Getter
  get bgv() {
    return this.acknowledgmentForm.get(this.form_bgv);
  }
  get caste_preview() {
    return this.acknowledgmentForm.get(this.form_caste_preview);
  }
  get coc() {
    return this.acknowledgmentForm.get(this.form_coc);
  }
  get joining() {
    return this.acknowledgmentForm.get(this.form_joining);
  }
  get terms_conditions() {
    return this.acknowledgmentForm.get(this.form_terms_conditions);
  }
  get ack_place() {
    return this.acknowledgmentForm.get(this.form_ack_place);
  }
  get ack_date() {
    return this.acknowledgmentForm.get(this.form_ack_date);
  }

}
