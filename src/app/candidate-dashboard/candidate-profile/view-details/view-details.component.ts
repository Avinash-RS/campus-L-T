import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import moment from 'moment';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {

  radioIsChecked = 'checked';
  userDetails: any;

  languages = [
    {
      name: 'English',
      proficiency: {
        read: true,
        write: true,
        speak: false
      }
    },
    {
      name: 'Tamil',
      proficiency: {
        read: false,
        write: true,
        speak: true
      }
    },
    {
      name: 'English',
      proficiency: {
        read: false,
        write: true,
        speak: false
      }
    },
  ];
  userData: any;
  apiForm: any;
  KYCModifiedData: any;
  localPhoto: any;
  url: any;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.appConfig.getLocalData('confirmClick') == 'true') {
      $event.returnValue = true;
      // return 'You have unsaved changes';
    }
  }

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (!this.appConfig.getLocalData('confirmClick')) {
      this.appConfig.setLocalData('confirmClick', 'false');
    }

    if (this.appConfig.getLocalData('kycForm')) {
      const data = JSON.parse(this.appConfig.getLocalData('kycForm'));
      this.apiForm = data;
      this.getLocalForm(data);
    } else {
      this.getUserDetails();
    }
  }

  refresh() {
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '';
    }
  }
  getMonthFormat(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '';
    }
  }

  getLocalForm(form) {
    this.apiForm = form;
    this.userData = this.apiForm;
    const organizeUserDetails = this.apiForm;
    let dob;
    const dobFormats = organizeUserDetails && organizeUserDetails['field_dob'] && organizeUserDetails['field_dob'] ? organizeUserDetails['field_dob']['value'] : '-';

    if (dobFormats) {
      const split = moment(dobFormats).format('DD/MM/YYYY').split('/');
      dob = {
        date: split[0],
        month: split[1],
        year: split[2],
      };
    } else {
      dob = {
        date: '',
        month: '',
        year: '',
      };
    }

    const dump = {
      name: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '',
      mail: this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '',
      // name: organizeUserDetails && organizeUserDetails['field_name'] && organizeUserDetails['field_name'] ? organizeUserDetails['field_name']['value'] : '-',
      // mail: organizeUserDetails && organizeUserDetails['field_email'] && organizeUserDetails['field_email'] ? organizeUserDetails['field_email']['value'] : '-',
      mobile: organizeUserDetails && organizeUserDetails['field_mobile'] && organizeUserDetails['field_mobile'] ? organizeUserDetails['field_mobile']['value'] : '-',
      gender: organizeUserDetails && organizeUserDetails['field_gender'] && organizeUserDetails['field_gender'] ? organizeUserDetails['field_gender']['value'] : '-',
      marital: organizeUserDetails && organizeUserDetails['field_mariatal_status'] && organizeUserDetails['field_mariatal_status'] ? organizeUserDetails['field_mariatal_status']['value'] : '-',
      dobDate: dob.date,
      dobMonth: dob.month,
      dobYear: dob.year,
      nationality: organizeUserDetails && organizeUserDetails.field_nationality && organizeUserDetails['field_nationality'] ? organizeUserDetails['field_nationality']['value'] : '-',
      aadhaar: organizeUserDetails && organizeUserDetails.field_aadharno && organizeUserDetails['field_aadharno'] ? organizeUserDetails['field_aadharno']['value'] : '-',
      category: organizeUserDetails && organizeUserDetails.field_category && organizeUserDetails['field_category'] ? organizeUserDetails['field_category']['value'] : '-',

      presentAddress1: organizeUserDetails && organizeUserDetails['field_present_line_street_addres'] && organizeUserDetails['field_present_line_street_addres'] ? organizeUserDetails['field_present_line_street_addres']['value'] : '-',
      presentAddress2: organizeUserDetails && organizeUserDetails['field_present_line2_street_addre'] && organizeUserDetails['field_present_line2_street_addre'] ? organizeUserDetails['field_present_line2_street_addre']['value'] : '-',
      presentZipCode: organizeUserDetails && organizeUserDetails['field_present_zip'] && organizeUserDetails['field_present_zip'] ? organizeUserDetails['field_present_zip']['value'] : '-',
      presentCity: organizeUserDetails && organizeUserDetails['field_preset_city'] && organizeUserDetails['field_preset_city'] ? organizeUserDetails['field_preset_city']['value'] : '-',
      presentState: organizeUserDetails && organizeUserDetails['field_present_state'] && organizeUserDetails['field_present_state'] ? organizeUserDetails['field_present_state']['value'] : '-',

      permanentAddress1: organizeUserDetails && organizeUserDetails['field_permanent_line1_street_add'] && organizeUserDetails['field_permanent_line1_street_add'] ? organizeUserDetails['field_permanent_line1_street_add']['value'] : '-',
      permanentAddress2: organizeUserDetails && organizeUserDetails['field_permanent_line2_street_add'] && organizeUserDetails['field_permanent_line2_street_add'] ? organizeUserDetails['field_permanent_line2_street_add']['value'] : '-',
      permanentZipCode: organizeUserDetails && organizeUserDetails['field_permanent_zip'] && organizeUserDetails['field_permanent_zip'] ? organizeUserDetails['field_permanent_zip']['value'] : '-',
      permanentCity: organizeUserDetails && organizeUserDetails['field_permanent_city'] && organizeUserDetails['field_permanent_city'] ? organizeUserDetails['field_permanent_city']['value'] : '-',
      permanentState: organizeUserDetails && organizeUserDetails['field_permanent_state'] && organizeUserDetails['field_permanent_state'] ? organizeUserDetails['field_permanent_state']['value'] : '-',

      // languagesknown: [{
      //   languageRequired: organizeUserDetails && organizeUserDetails['field_language'] && organizeUserDetails['field_language'] ? organizeUserDetails['field_language']['value'] : '-',

      //   firstRead: organizeUserDetails && organizeUserDetails['field_read'] && organizeUserDetails['field_read'][0] ? organizeUserDetails['field_read'][0]['value'] : '-',
      //   firstWrite: organizeUserDetails && organizeUserDetails['field_write'] && organizeUserDetails['field_write'][0] ? organizeUserDetails['field_write'][0]['value'] : '-',
      //   firstSpeak: organizeUserDetails && organizeUserDetails['field_speak'] && organizeUserDetails['field_speak'][0] ? organizeUserDetails['field_speak'][0]['value'] : '-',
      // }],
      languagesknown: this.apiForm['langArr'],

      field_profile_image: [
        {
          target_id: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['target_id'] : '',
          alt: 'Image',
          title: '',
          width: 210,
          height: 230,
          target_uuid: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['target_uuid'] : '',
          url: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['url'] : '',
          status: 'true'
        }
      ],


      passportNumber: organizeUserDetails && organizeUserDetails['field_passport_number'] && organizeUserDetails['field_passport_number'] ? organizeUserDetails['field_passport_number']['value'] : '-',
      passportName: organizeUserDetails && organizeUserDetails['field_name_as_in_passport'] && organizeUserDetails['field_name_as_in_passport'] ? organizeUserDetails['field_name_as_in_passport']['value'] : '-',
      passportProfession: organizeUserDetails && organizeUserDetails['field_profesiona_as_passport'] && organizeUserDetails['field_profesiona_as_passport'] ? organizeUserDetails['field_profesiona_as_passport']['value'] : '-',
      passportIssueDate: organizeUserDetails && organizeUserDetails['field_date_of_issue'] && organizeUserDetails['field_date_of_issue'] ? this.getDateFormat(organizeUserDetails['field_date_of_issue']['value']) : '-',
      passportValid: organizeUserDetails && organizeUserDetails['field_valid_upto'] && organizeUserDetails['field_valid_upto'] ? this.getDateFormat(organizeUserDetails['field_valid_upto']['value']) : '-',
      passportIssuePlace: organizeUserDetails && organizeUserDetails['field_place_of_issue'] && organizeUserDetails['field_place_of_issue'] ? organizeUserDetails['field_place_of_issue']['value'] : '-',
      passportValidFor: organizeUserDetails && organizeUserDetails['field_country_valid_for'] && organizeUserDetails['field_country_valid_for'] ? organizeUserDetails['field_country_valid_for']['value'] : '-',

      illness: organizeUserDetails && organizeUserDetails['field_serious_illness'] && organizeUserDetails['field_serious_illness'] ? organizeUserDetails['field_serious_illness']['value'] : '-',
      daysofIll: organizeUserDetails && organizeUserDetails['field_no_of_days'] && organizeUserDetails['field_no_of_days'] ? organizeUserDetails['field_no_of_days']['value'] : '-',
      natureofIll: organizeUserDetails && organizeUserDetails['field_nature_of_illness'] && organizeUserDetails['field_nature_of_illness'] ? organizeUserDetails['field_nature_of_illness']['value'] : '-',
      disability: organizeUserDetails && organizeUserDetails['field_physical_disability'] && organizeUserDetails['field_physical_disability'] ? organizeUserDetails['field_physical_disability']['value'] : '-',
      height: organizeUserDetails && organizeUserDetails['field_height'] && organizeUserDetails['field_height'] ? organizeUserDetails['field_height']['value'] : '-',
      weight: organizeUserDetails && organizeUserDetails['field_weight'] && organizeUserDetails['field_weight'] ? organizeUserDetails['field_weight']['value'] : '-',
      left: organizeUserDetails && organizeUserDetails['field_left_eyepower_glass'] && organizeUserDetails['field_left_eyepower_glass'] ? organizeUserDetails['field_left_eyepower_glass']['value'] : '-',
      right: organizeUserDetails && organizeUserDetails['field_right_eye_power_glass'] && organizeUserDetails['field_right_eye_power_glass'] ? organizeUserDetails['field_right_eye_power_glass']['value'] : '-',

      // educationValuearray: [{
      //   leveling: this.apiForm && this.apiForm['field_level'] ? this.apiForm['field_level']['value'] : '-',
      //   board: this.apiForm && this.apiForm['field_board_university'] ? this.apiForm['field_board_university']['value'] : '-',
      //   institute: this.apiForm && this.apiForm['field_institute'] ? this.apiForm['field_institute']['value'] : '-',
      //   discipline: this.apiForm && this.apiForm['field_discipline'] ? this.apiForm['field_discipline']['value'] : '-',
      //   specification: this.apiForm && this.apiForm['field_specification'] ? this.apiForm['field_specification']['value'] : '-',
      //   passedYear: this.apiForm && this.apiForm['field_year_of_passing'] ? this.getMonthFormat(this.apiForm['field_year_of_passing']['value']) : '-',
      //   backlogs: this.apiForm && this.apiForm['field_backlogs'] ? this.apiForm['field_backlogs']['value'] : '-',
      //   percentage: this.apiForm && this.apiForm['field_percentage'] ? this.apiForm['field_percentage']['value'] : '-',
      // }],
      educationValuearray: this.apiForm['eduArr'],

      familyValuesArr: this.apiForm['famArr'],
      // familyValuesArr: [{
      //   names: this.apiForm && this.apiForm['field_name_of_your_family'] ? this.apiForm['field_name_of_your_family']['value'] : '-',
      //   dob: this.apiForm && this.apiForm['field_family_date_of_birth'] ? this.getDateFormat(this.apiForm['field_family_date_of_birth']['value']) : '-',
      //   relationship: this.apiForm && this.apiForm['field_relationship'] ? this.apiForm['field_relationship']['value'] : '-',
      //   occupation: this.apiForm && this.apiForm['field_occupation'] ? this.apiForm['field_occupation']['value'] : '-',
      // }],

      skillValueArray: this.apiForm && this.apiForm['field_skills'] ? this.apiForm['field_skills'] : [{ value: '' }],
      generalArray: [{
        names: this.apiForm && this.apiForm['field_relatives_l_t_group_name'] ? this.apiForm['field_relatives_l_t_group_name']['value'] : '-',
        relationship: this.apiForm && this.apiForm['field_realationship'] ? this.apiForm['field_realationship']['value'] : '-',
        position: this.apiForm && this.apiForm['field_position'] ? this.apiForm['field_position']['value'] : '-',
        company: this.apiForm && this.apiForm['field_company'] ? this.apiForm['field_company']['value'] : '-',
      },
      {
        names: this.apiForm && this.apiForm['field_relatives1'] ? this.apiForm['field_relatives1']['value'] : '-',
        relationship: this.apiForm && this.apiForm['field_relative_relation1'] ? this.apiForm['field_relative_relation1']['value'] : '-',
        position: this.apiForm && this.apiForm['field_relative_position1'] ? this.apiForm['field_relative_position1']['value'] : '-',
        company: this.apiForm && this.apiForm['field_relative_company1'] ? this.apiForm['field_relative_company1']['value'] : '-',
      }],
      facultyReference1: this.apiForm && this.apiForm['field_faculty_reference'] ? this.apiForm['field_faculty_reference']['value'] : '-',
      facultyReference2: this.apiForm && this.apiForm['field_faculty_reference1'] ? this.apiForm['field_faculty_reference1']['value'] : '-'
    };

    if (this.appConfig.getLocalData('localProfilePic') && this.appConfig.getLocalData('localProfilePic') == 'null') {
      this.url = `${this.appConfig.imageBaseUrl()}/d8cintana2/sites/default/files/2020-06/filename1_1.jpg`;
    }
    if (!this.appConfig.getLocalData('localProfilePic')) {
      this.url = !dump['field_profile_image'][0]['url'].includes('filename1_1.jpg') ? dump['field_profile_image'][0]['url'] : dump['field_profile_image'][0]['url'];
    }
    if (this.appConfig.getLocalData('localProfilePic') && this.appConfig.getLocalData('localProfilePic') !== 'null' && this.appConfig.getLocalData('localProfilePic') !== 'undefined') {
      this.url = JSON.parse(this.appConfig.getLocalData('localProfilePic'));
    }

    dump.familyValuesArr.forEach(element => {
      if (element['field_family_date_of_birth']) {
        element['field_family_date_of_birth'] = {value: this.getDateFormat(element['field_family_date_of_birth']['value']) && this.getDateFormat(element['field_family_date_of_birth']['value']) != 'INVALID DATE ' ? this.getDateFormat(element['field_family_date_of_birth']['value']) : '' };
      }
    });
    dump.educationValuearray.forEach(element => {
      if (element['field_year_of_passing']) {
        element['field_year_of_passing'] = {value: this.getMonthFormat(element['field_year_of_passing']['value'])};
      }
    });
    this.userDetails = dump;
    console.log(this.userDetails);

  }
  getUserDetails() {
    this.candidateService.getUserProfile().subscribe((data: any) => {
      this.appConfig.setLocalData('KYCAPI', JSON.stringify(data));
      if (data && data.length > 0) {
        if (data[0] && data[0]['field_isformsubmitted'] && data[0]['field_isformsubmitted'][0] && data[0]['field_isformsubmitted'][0]['value'] === true) {
          this.appConfig.setLocalData('field_isformsubmitted', 'true');
          this.appConfig.setLocalData('personalFormSubmitted', 'true');
          this.appConfig.setLocalData('educationalFormSubmitted', 'true');
          this.appConfig.setLocalData('familyFormSubmitted', 'true');
          this.appConfig.setLocalData('generalFormSubmitted', 'true');
          this.appConfig.setLocalData('confirmFormSubmitted', 'true');
        } else {
          this.appConfig.setLocalData('field_isformsubmitted', 'false');
          this.appConfig.setLocalData('personalFormSubmitted', 'false');
          this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          this.appConfig.setLocalData('familyFormSubmitted', 'false');
          this.appConfig.setLocalData('generalFormSubmitted', 'false');
          this.appConfig.setLocalData('confirmFormSubmitted', 'false');
        }
      } else {
        this.appConfig.setLocalData('field_isformsubmitted', 'false');
        this.appConfig.setLocalData('personalFormSubmitted', 'false');
        this.appConfig.setLocalData('educationalFormSubmitted', 'false');
        this.appConfig.setLocalData('familyFormSubmitted', 'false');
        this.appConfig.setLocalData('generalFormSubmitted', 'false');
        this.appConfig.setLocalData('confirmFormSubmitted', 'false');
      }
      const datas = [];
      this.userData = data;
      if (this.userData && this.userData.length > 0) {
        console.log(data[0]);
        this.userDetails = data[0];
        const organizeUserDetails = data[0];
        // Changing Dob Date Format
        let dob;
        const dobFormats = organizeUserDetails && organizeUserDetails.field_dob && organizeUserDetails.field_dob[0].value ? organizeUserDetails.field_dob[0].value : '-';
        if (dobFormats) {
          const split = moment(dobFormats).format('DD/MM/YYYY').split('/');
          dob = {
            date: split[0],
            month: split[1],
            year: split[2],
          };
        } else {
          dob = {
            date: '-',
            month: '-',
            year: '-',
          };
        }

        this.KYCModifiedData = data;
        this.KYCModifiedData = {
          type: 'candidate',

          uid: [
            {
              target_id: this.appConfig.getLocalData('userId')
            }
          ],
          field_name: { value: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '' },
          field_email: { value: this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '' },
          // field_name: { value: organizeUserDetails && organizeUserDetails['field_name'] && organizeUserDetails['field_name'][0] ? organizeUserDetails['field_name'][0]['value'] : '' },
          // field_email: { value: organizeUserDetails && organizeUserDetails['field_email'] && organizeUserDetails['field_email'][0] ? organizeUserDetails['field_email'][0]['value'] : '' },
          field_mobile: { value: organizeUserDetails && organizeUserDetails['field_mobile'] && organizeUserDetails['field_mobile'][0] ? organizeUserDetails['field_mobile'][0]['value'] : '' },
          field_gender: { value: organizeUserDetails && organizeUserDetails['field_gender'] && organizeUserDetails['field_gender'][0] ? organizeUserDetails['field_gender'][0]['value'] : '' },
          field_mariatal_status: { value: organizeUserDetails && organizeUserDetails['field_mariatal_status'] && organizeUserDetails['field_mariatal_status'][0] ? organizeUserDetails['field_mariatal_status'][0]['value'] : '' },
          field_dob: { value: organizeUserDetails && organizeUserDetails['field_dob'] && organizeUserDetails['field_dob'][0] ? organizeUserDetails['field_dob'][0]['value'] : '' },
          field_nationality: { value: organizeUserDetails && organizeUserDetails['field_nationality'] && organizeUserDetails['field_nationality'][0] ? organizeUserDetails['field_nationality'][0]['value'] : '' },
          field_aadharno: { value: organizeUserDetails && organizeUserDetails['field_aadharno'] && organizeUserDetails['field_aadharno'][0] ? organizeUserDetails['field_aadharno'][0]['value'] : '' },
          field_category: { value: organizeUserDetails && organizeUserDetails['field_category'] && organizeUserDetails['field_category'][0] ? organizeUserDetails['field_category'][0]['value'] : '' },

          field_present_line_street_addres: { value: organizeUserDetails && organizeUserDetails['field_present_line_street_addres'] && organizeUserDetails['field_present_line_street_addres'][0] ? organizeUserDetails['field_present_line_street_addres'][0]['value'] : '' },
          field_present_line2_street_addre: { value: organizeUserDetails && organizeUserDetails['field_present_line2_street_addre'] && organizeUserDetails['field_present_line2_street_addre'][0] ? organizeUserDetails['field_present_line2_street_addre'][0]['value'] : '' },
          field_present_zip: { value: organizeUserDetails && organizeUserDetails['field_present_zip'] && organizeUserDetails['field_present_zip'][0] ? organizeUserDetails['field_present_zip'][0]['value'] : '' },
          field_preset_city: { value: organizeUserDetails && organizeUserDetails['field_preset_city'] && organizeUserDetails['field_preset_city'][0] ? organizeUserDetails['field_preset_city'][0]['value'] : '' },
          field_present_state: { value: organizeUserDetails && organizeUserDetails['field_present_state'] && organizeUserDetails['field_present_state'][0] ? organizeUserDetails['field_present_state'][0]['value'] : '' },

          field_address_checkbox: { value: organizeUserDetails && organizeUserDetails['field_address_checkbox'] && organizeUserDetails['field_address_checkbox'][0] ? organizeUserDetails['field_address_checkbox'][0]['value'] : false },

          field_permanent_line1_street_add: { value: organizeUserDetails && organizeUserDetails['field_permanent_line1_street_add'] && organizeUserDetails['field_permanent_line1_street_add'][0] ? organizeUserDetails['field_permanent_line1_street_add'][0]['value'] : '' },
          field_permanent_line2_street_add: { value: organizeUserDetails && organizeUserDetails['field_permanent_line2_street_add'] && organizeUserDetails['field_permanent_line2_street_add'][0] ? organizeUserDetails['field_permanent_line2_street_add'][0]['value'] : '' },
          field_permanent_zip: { value: organizeUserDetails && organizeUserDetails['field_permanent_zip'] && organizeUserDetails['field_permanent_zip'][0] ? organizeUserDetails['field_permanent_zip'][0]['value'] : '' },
          field_permanent_city: { value: organizeUserDetails && organizeUserDetails['field_permanent_city'] && organizeUserDetails['field_permanent_city'][0] ? organizeUserDetails['field_permanent_city'][0]['value'] : '' },
          field_permanent_state: { value: organizeUserDetails && organizeUserDetails['field_permanent_state'] && organizeUserDetails['field_permanent_state'][0] ? organizeUserDetails['field_permanent_state'][0]['value'] : '' },

          // field_language: { value: organizeUserDetails && organizeUserDetails['field_language'] && organizeUserDetails['field_language'][0] ? organizeUserDetails['field_language'][0]['value'] : '' },

          // field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read'] && organizeUserDetails['field_read'][0] ? organizeUserDetails['field_read'][0]['value'] : '' }],
          // field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write'] && organizeUserDetails['field_write'][0] ? organizeUserDetails['field_write'][0]['value'] : '' }],
          // field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak'] && organizeUserDetails['field_speak'][0] ? organizeUserDetails['field_speak'][0]['value'] : '' }],

          field_passport_number: { value: organizeUserDetails && organizeUserDetails['field_passport_number'] && organizeUserDetails['field_passport_number'][0] ? organizeUserDetails['field_passport_number'][0]['value'] : '' },
          field_name_as_in_passport: { value: organizeUserDetails && organizeUserDetails['field_name_as_in_passport'] && organizeUserDetails['field_name_as_in_passport'][0] ? organizeUserDetails['field_name_as_in_passport'][0]['value'] : '' },
          field_profesiona_as_passport: { value: organizeUserDetails && organizeUserDetails['field_profesiona_as_passport'] && organizeUserDetails['field_profesiona_as_passport'][0] ? organizeUserDetails['field_profesiona_as_passport'][0]['value'] : '' },
          field_date_of_issue: { value: organizeUserDetails && organizeUserDetails['field_date_of_issue'] && organizeUserDetails['field_date_of_issue'][0] ? organizeUserDetails['field_date_of_issue'][0]['value'] : '' },
          field_valid_upto: { value: organizeUserDetails && organizeUserDetails['field_valid_upto'] && organizeUserDetails['field_valid_upto'][0] ? organizeUserDetails['field_valid_upto'][0]['value'] : '' },
          field_place_of_issue: { value: organizeUserDetails && organizeUserDetails['field_place_of_issue'] && organizeUserDetails['field_place_of_issue'][0] ? organizeUserDetails['field_place_of_issue'][0]['value'] : '' },
          field_country_valid_for: { value: organizeUserDetails && organizeUserDetails['field_country_valid_for'] && organizeUserDetails['field_country_valid_for'][0] ? organizeUserDetails['field_country_valid_for'][0]['value'] : '' },

          field_serious_illness: { value: organizeUserDetails && organizeUserDetails['field_serious_illness'] && organizeUserDetails['field_serious_illness'][0] ? organizeUserDetails['field_serious_illness'][0]['value'] : '' },
          field_no_of_days: { value: organizeUserDetails && organizeUserDetails['field_no_of_days'] && organizeUserDetails['field_no_of_days'][0] ? organizeUserDetails['field_no_of_days'][0]['value'] : '' },
          field_nature_of_illness: { value: organizeUserDetails && organizeUserDetails['field_nature_of_illness'] && organizeUserDetails['field_nature_of_illness'][0] ? organizeUserDetails['field_nature_of_illness'][0]['value'] : '' },
          field_physical_disability: { value: organizeUserDetails && organizeUserDetails['field_physical_disability'] && organizeUserDetails['field_physical_disability'][0] ? organizeUserDetails['field_physical_disability'][0]['value'] : '' },
          field_height: { value: organizeUserDetails && organizeUserDetails['field_height'] && organizeUserDetails['field_height'][0] ? organizeUserDetails['field_height'][0]['value'] : '' },
          field_weight: { value: organizeUserDetails && organizeUserDetails['field_weight'] && organizeUserDetails['field_weight'][0] ? organizeUserDetails['field_weight'][0]['value'] : '' },
          field_right_eye_power_glass: { value: organizeUserDetails && organizeUserDetails['field_right_eye_power_glass'] && organizeUserDetails['field_right_eye_power_glass'][0] ? organizeUserDetails['field_right_eye_power_glass'][0]['value'] : '' },
          field_left_eyepower_glass: { value: organizeUserDetails && organizeUserDetails['field_left_eyepower_glass'] && organizeUserDetails['field_left_eyepower_glass'][0] ? organizeUserDetails['field_left_eyepower_glass'][0]['value'] : '' },

          field_profile_image: [
            {
              target_id: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['target_id'] : '',
              alt: 'Image',
              title: '',
              width: 210,
              height: 230,
              target_uuid: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['target_uuid'] : '',
              url: organizeUserDetails && organizeUserDetails['field_profile_image'] && organizeUserDetails['field_profile_image'][0] ? organizeUserDetails['field_profile_image'][0]['url'] : '',
              status: 'true'
            }
          ],

          // Educational
          // field_level: { value: organizeUserDetails && organizeUserDetails['field_level'] && organizeUserDetails['field_level'][0] ? organizeUserDetails['field_level'][0]['value'] : '' },
          // field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university'] && organizeUserDetails['field_board_university'][0] ? organizeUserDetails['field_board_university'][0]['value'] : '' },
          // field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute'] && organizeUserDetails['field_institute'][0] ? organizeUserDetails['field_institute'][0]['value'] : '' },
          // field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline'] && organizeUserDetails['field_discipline'][0] ? organizeUserDetails['field_discipline'][0]['value'] : '' },
          // field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification'] && organizeUserDetails['field_specification'][0] ? organizeUserDetails['field_specification'][0]['value'] : '' },
          // field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing'] && organizeUserDetails['field_year_of_passing'][0] ? organizeUserDetails['field_year_of_passing'][0]['value'] : '' },
          // field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs'] && organizeUserDetails['field_backlogs'][0] ? organizeUserDetails['field_backlogs'][0]['value'] : '' },
          // field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage'] && organizeUserDetails['field_percentage'][0] ? organizeUserDetails['field_percentage'][0]['value'] : '' },

          // Family
          field_name_of_your_family: { value: organizeUserDetails && organizeUserDetails['field_name_of_your_family'] && organizeUserDetails['field_name_of_your_family'][0] ? organizeUserDetails['field_name_of_your_family'][0]['value'] : '' },
          field_family_date_of_birth: { value: organizeUserDetails && organizeUserDetails['field_family_date_of_birth'] && organizeUserDetails['field_family_date_of_birth'][0] ? organizeUserDetails['field_family_date_of_birth'][0]['value'] : '' },
          field_relationship: { value: organizeUserDetails && organizeUserDetails['field_relationship'] && organizeUserDetails['field_relationship'][0] ? organizeUserDetails['field_relationship'][0]['value'] : '' },
          field_occupation: { value: organizeUserDetails && organizeUserDetails['field_occupation'] && organizeUserDetails['field_occupation'][0] ? organizeUserDetails['field_occupation'][0]['value'] : '' },

          // General
          field_skills: organizeUserDetails && organizeUserDetails['field_skills'] ? organizeUserDetails && organizeUserDetails['field_skills'] : [{ value: '' }],
          // field_add_your_skills: { value: organizeUserDetails && organizeUserDetails['field_add_your_skills'] && organizeUserDetails['field_add_your_skills'][0] ? organizeUserDetails['field_add_your_skills'][0]['value'] : '' },
          field_relatives_l_t_group_name: { value: organizeUserDetails && organizeUserDetails['field_relatives_l_t_group_name'] && organizeUserDetails['field_relatives_l_t_group_name'][0] ? organizeUserDetails['field_relatives_l_t_group_name'][0]['value'] : '' },
          field_realationship: { value: organizeUserDetails && organizeUserDetails['field_realationship'] && organizeUserDetails['field_realationship'][0] ? organizeUserDetails['field_realationship'][0]['value'] : '' },
          field_position: { value: organizeUserDetails && organizeUserDetails['field_position'] && organizeUserDetails['field_position'][0] ? organizeUserDetails['field_position'][0]['value'] : '' },
          field_company: { value: organizeUserDetails && organizeUserDetails['field_company'] && organizeUserDetails['field_company'][0] ? organizeUserDetails['field_company'][0]['value'] : '' },
          field_faculty_reference: { value: organizeUserDetails && organizeUserDetails['field_faculty_reference'] && organizeUserDetails['field_faculty_reference'][0] ? organizeUserDetails['field_faculty_reference'][0]['value'] : '' },
          field_faculty_reference1: { value: organizeUserDetails && organizeUserDetails['field_faculty_reference1'] && organizeUserDetails['field_faculty_reference1'][0] ? organizeUserDetails['field_faculty_reference1'][0]['value'] : '' },
          field_relatives1: { value: organizeUserDetails && organizeUserDetails['field_relatives1'] && organizeUserDetails['field_relatives1'][0] ? organizeUserDetails['field_relatives1'][0]['value'] : '' },
          field_relative_relation1: { value: organizeUserDetails && organizeUserDetails['field_relative_relation1'] && organizeUserDetails['field_relative_relation1'][0] ? organizeUserDetails['field_relative_relation1'][0]['value'] : '' },
          field_relative_position1: { value: organizeUserDetails && organizeUserDetails['field_relative_position1'] && organizeUserDetails['field_relative_position1'][0] ? organizeUserDetails['field_relative_position1'][0]['value'] : '' },
          field_relative_company1: { value: organizeUserDetails && organizeUserDetails['field_relative_company1'] && organizeUserDetails['field_relative_company1'][0] ? organizeUserDetails['field_relative_company1'][0]['value'] : '' },

          is_default: [{
            value: '1'
          }],
          field_isformsubmitted: [
            {
              value: true
            }
          ],
        };
        // For Language Array
        this.KYCModifiedData['langArr'] = [
          {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language'] && organizeUserDetails['field_language'][0] ? organizeUserDetails['field_language'][0]['value'] : '' },

            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read'] && organizeUserDetails['field_read'][0] ? organizeUserDetails['field_read'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write'] && organizeUserDetails['field_write'][0] ? organizeUserDetails['field_write'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak'] && organizeUserDetails['field_speak'][0] ? organizeUserDetails['field_speak'][0]['value'] : '' }],
          }
        ];
        if (organizeUserDetails && organizeUserDetails['field_language1'].length > 0) {
          const a = {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language1'] && organizeUserDetails['field_language1'][0] ? organizeUserDetails['field_language1'][0]['value'] : '' },
            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read1'] && organizeUserDetails['field_read1'][0] ? organizeUserDetails['field_read1'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write1'] && organizeUserDetails['field_write1'][0] ? organizeUserDetails['field_write1'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak1'] && organizeUserDetails['field_speak1'][0] ? organizeUserDetails['field_speak1'][0]['value'] : '' }],
          };
          this.KYCModifiedData['langArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_language2'].length > 0) {
          const a = {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language2'] && organizeUserDetails['field_language2'][0] ? organizeUserDetails['field_language2'][0]['value'] : '' },
            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read2'] && organizeUserDetails['field_read2'][0] ? organizeUserDetails['field_read2'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write2'] && organizeUserDetails['field_write2'][0] ? organizeUserDetails['field_write2'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak2'] && organizeUserDetails['field_speak2'][0] ? organizeUserDetails['field_speak2'][0]['value'] : '' }],
          };
          this.KYCModifiedData['langArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_language3'].length > 0) {
          const a = {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language3'] && organizeUserDetails['field_language3'][0] ? organizeUserDetails['field_language3'][0]['value'] : '' },
            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read3'] && organizeUserDetails['field_read3'][0] ? organizeUserDetails['field_read3'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write3'] && organizeUserDetails['field_write3'][0] ? organizeUserDetails['field_write3'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak3'] && organizeUserDetails['field_speak3'][0] ? organizeUserDetails['field_speak3'][0]['value'] : '' }],
          };
          this.KYCModifiedData['langArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_language4'].length > 0) {
          const a = {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language4'] && organizeUserDetails['field_language4'][0] ? organizeUserDetails['field_language4'][0]['value'] : '' },
            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read4'] && organizeUserDetails['field_read4'][0] ? organizeUserDetails['field_read4'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write4'] && organizeUserDetails['field_write4'][0] ? organizeUserDetails['field_write4'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak4'] && organizeUserDetails['field_speak4'][0] ? organizeUserDetails['field_speak4'][0]['value'] : '' }],
          };
          this.KYCModifiedData['langArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_language5'].length > 0) {
          const a = {
            field_language: { value: organizeUserDetails && organizeUserDetails['field_language5'] && organizeUserDetails['field_language5'][0] ? organizeUserDetails['field_language5'][0]['value'] : '' },
            field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read5'] && organizeUserDetails['field_read5'][0] ? organizeUserDetails['field_read5'][0]['value'] : '' }],
            field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write5'] && organizeUserDetails['field_write5'][0] ? organizeUserDetails['field_write5'][0]['value'] : '' }],
            field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak5'] && organizeUserDetails['field_speak5'][0] ? organizeUserDetails['field_speak5'][0]['value'] : '' }],
          };
          this.KYCModifiedData['langArr'].push(a);
        }


        // For Educational Array
        this.KYCModifiedData['eduArr'] = [
          {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level'] && organizeUserDetails['field_level'][0] ? organizeUserDetails['field_level'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university'] && organizeUserDetails['field_board_university'][0] ? organizeUserDetails['field_board_university'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute'] && organizeUserDetails['field_institute'][0] ? organizeUserDetails['field_institute'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline'] && organizeUserDetails['field_discipline'][0] ? organizeUserDetails['field_discipline'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification'] && organizeUserDetails['field_specification'][0] ? organizeUserDetails['field_specification'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing'] && organizeUserDetails['field_year_of_passing'][0] ? organizeUserDetails['field_year_of_passing'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs'] && organizeUserDetails['field_backlogs'][0] ? organizeUserDetails['field_backlogs'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage'] && organizeUserDetails['field_percentage'][0] ? organizeUserDetails['field_percentage'][0]['value'] : '' },
          }
        ];
        if (organizeUserDetails && organizeUserDetails['field_level1'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level1'] && organizeUserDetails['field_level1'][0] ? organizeUserDetails['field_level1'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university1'] && organizeUserDetails['field_board_university1'][0] ? organizeUserDetails['field_board_university1'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute1'] && organizeUserDetails['field_institute1'][0] ? organizeUserDetails['field_institute1'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline1'] && organizeUserDetails['field_discipline1'][0] ? organizeUserDetails['field_discipline1'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification1'] && organizeUserDetails['field_specification1'][0] ? organizeUserDetails['field_specification1'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing1'] && organizeUserDetails['field_year_of_passing1'][0] ? organizeUserDetails['field_year_of_passing1'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs1'] && organizeUserDetails['field_backlogs1'][0] ? organizeUserDetails['field_backlogs1'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage1'] && organizeUserDetails['field_percentage1'][0] ? organizeUserDetails['field_percentage1'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level2'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level2'] && organizeUserDetails['field_level2'][0] ? organizeUserDetails['field_level2'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university2'] && organizeUserDetails['field_board_university2'][0] ? organizeUserDetails['field_board_university2'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute2'] && organizeUserDetails['field_institute2'][0] ? organizeUserDetails['field_institute2'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline2'] && organizeUserDetails['field_discipline2'][0] ? organizeUserDetails['field_discipline2'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification2'] && organizeUserDetails['field_specification2'][0] ? organizeUserDetails['field_specification2'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing2'] && organizeUserDetails['field_year_of_passing2'][0] ? organizeUserDetails['field_year_of_passing2'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs2'] && organizeUserDetails['field_backlogs2'][0] ? organizeUserDetails['field_backlogs2'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage2'] && organizeUserDetails['field_percentage2'][0] ? organizeUserDetails['field_percentage2'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level3'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level3'] && organizeUserDetails['field_level3'][0] ? organizeUserDetails['field_level3'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university3'] && organizeUserDetails['field_board_university3'][0] ? organizeUserDetails['field_board_university3'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute3'] && organizeUserDetails['field_institute3'][0] ? organizeUserDetails['field_institute3'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline3'] && organizeUserDetails['field_discipline3'][0] ? organizeUserDetails['field_discipline3'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification3'] && organizeUserDetails['field_specification3'][0] ? organizeUserDetails['field_specification3'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing3'] && organizeUserDetails['field_year_of_passing3'][0] ? organizeUserDetails['field_year_of_passing3'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs3'] && organizeUserDetails['field_backlogs3'][0] ? organizeUserDetails['field_backlogs3'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage3'] && organizeUserDetails['field_percentage3'][0] ? organizeUserDetails['field_percentage3'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level4'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level4'] && organizeUserDetails['field_level4'][0] ? organizeUserDetails['field_level4'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university4'] && organizeUserDetails['field_board_university4'][0] ? organizeUserDetails['field_board_university4'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute4'] && organizeUserDetails['field_institute4'][0] ? organizeUserDetails['field_institute4'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline4'] && organizeUserDetails['field_discipline4'][0] ? organizeUserDetails['field_discipline4'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification4'] && organizeUserDetails['field_specification4'][0] ? organizeUserDetails['field_specification4'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing4'] && organizeUserDetails['field_year_of_passing4'][0] ? organizeUserDetails['field_year_of_passing4'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs4'] && organizeUserDetails['field_backlogs4'][0] ? organizeUserDetails['field_backlogs4'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage4'] && organizeUserDetails['field_percentage4'][0] ? organizeUserDetails['field_percentage4'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level5'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level5'] && organizeUserDetails['field_level5'][0] ? organizeUserDetails['field_level5'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university5'] && organizeUserDetails['field_board_university5'][0] ? organizeUserDetails['field_board_university5'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute5'] && organizeUserDetails['field_institute5'][0] ? organizeUserDetails['field_institute5'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline5'] && organizeUserDetails['field_discipline5'][0] ? organizeUserDetails['field_discipline5'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification5'] && organizeUserDetails['field_specification5'][0] ? organizeUserDetails['field_specification5'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing5'] && organizeUserDetails['field_year_of_passing5'][0] ? organizeUserDetails['field_year_of_passing5'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs5'] && organizeUserDetails['field_backlogs5'][0] ? organizeUserDetails['field_backlogs5'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage5'] && organizeUserDetails['field_percentage5'][0] ? organizeUserDetails['field_percentage5'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level6'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level6'] && organizeUserDetails['field_level6'][0] ? organizeUserDetails['field_level6'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university6'] && organizeUserDetails['field_board_university6'][0] ? organizeUserDetails['field_board_university6'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute6'] && organizeUserDetails['field_institute6'][0] ? organizeUserDetails['field_institute6'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline6'] && organizeUserDetails['field_discipline6'][0] ? organizeUserDetails['field_discipline6'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification6'] && organizeUserDetails['field_specification6'][0] ? organizeUserDetails['field_specification6'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing6'] && organizeUserDetails['field_year_of_passing6'][0] ? organizeUserDetails['field_year_of_passing6'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs6'] && organizeUserDetails['field_backlogs6'][0] ? organizeUserDetails['field_backlogs6'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage6'] && organizeUserDetails['field_percentage6'][0] ? organizeUserDetails['field_percentage6'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level7'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level7'] && organizeUserDetails['field_level7'][0] ? organizeUserDetails['field_level7'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university7'] && organizeUserDetails['field_board_university7'][0] ? organizeUserDetails['field_board_university7'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute7'] && organizeUserDetails['field_institute7'][0] ? organizeUserDetails['field_institute7'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline7'] && organizeUserDetails['field_discipline7'][0] ? organizeUserDetails['field_discipline7'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification7'] && organizeUserDetails['field_specification7'][0] ? organizeUserDetails['field_specification7'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing7'] && organizeUserDetails['field_year_of_passing7'][0] ? organizeUserDetails['field_year_of_passing7'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs7'] && organizeUserDetails['field_backlogs7'][0] ? organizeUserDetails['field_backlogs7'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage7'] && organizeUserDetails['field_percentage7'][0] ? organizeUserDetails['field_percentage7'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level8'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level8'] && organizeUserDetails['field_level8'][0] ? organizeUserDetails['field_level8'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university8'] && organizeUserDetails['field_board_university8'][0] ? organizeUserDetails['field_board_university8'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute8'] && organizeUserDetails['field_institute8'][0] ? organizeUserDetails['field_institute8'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline8'] && organizeUserDetails['field_discipline8'][0] ? organizeUserDetails['field_discipline8'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification8'] && organizeUserDetails['field_specification8'][0] ? organizeUserDetails['field_specification8'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing8'] && organizeUserDetails['field_year_of_passing8'][0] ? organizeUserDetails['field_year_of_passing8'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs8'] && organizeUserDetails['field_backlogs8'][0] ? organizeUserDetails['field_backlogs8'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage8'] && organizeUserDetails['field_percentage8'][0] ? organizeUserDetails['field_percentage8'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }
        if (organizeUserDetails && organizeUserDetails['field_level9'].length > 0) {
          const a = {
            field_level: { value: organizeUserDetails && organizeUserDetails['field_level9'] && organizeUserDetails['field_level9'][0] ? organizeUserDetails['field_level9'][0]['value'] : '' },
            field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university9'] && organizeUserDetails['field_board_university9'][0] ? organizeUserDetails['field_board_university9'][0]['value'] : '' },
            field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute9'] && organizeUserDetails['field_institute9'][0] ? organizeUserDetails['field_institute9'][0]['value'] : '' },
            field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline9'] && organizeUserDetails['field_discipline9'][0] ? organizeUserDetails['field_discipline9'][0]['value'] : '' },
            field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification9'] && organizeUserDetails['field_specification9'][0] ? organizeUserDetails['field_specification9'][0]['value'] : '' },
            field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing9'] && organizeUserDetails['field_year_of_passing9'][0] ? organizeUserDetails['field_year_of_passing9'][0]['value'] : '' },
            field_backlogs: { value: organizeUserDetails && organizeUserDetails['field_backlogs9'] && organizeUserDetails['field_backlogs9'][0] ? organizeUserDetails['field_backlogs9'][0]['value'] : '' },
            field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage9'] && organizeUserDetails['field_percentage9'][0] ? organizeUserDetails['field_percentage9'][0]['value'] : '' },
          };
          this.KYCModifiedData['eduArr'].push(a);
        }

        this.url = !this.KYCModifiedData['field_profile_image'][0]['url'].includes('filename1_1.jpg') ? this.KYCModifiedData['field_profile_image'][0]['url'] : this.KYCModifiedData['field_profile_image'][0]['url'];
        this.appConfig.setLocalData('kycForm', JSON.stringify(this.KYCModifiedData));

        this.appConfig.setLocalData('kycForm', JSON.stringify(this.KYCModifiedData));
        this.getLocalForm(this.KYCModifiedData);
        this.appConfig.hideLoader();

      } else {
        this.appConfig.hideLoader();
        this.userDetails = {
          name: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '',
          mail: this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '',
          mobile: '',
          gender: '',
          marital: '',
          dobDate: '',
          dobMonth: '',
          dobYear: '',
          nationality: '',
          aadhaar: '',
          category: '',

          field_address_checkbox: {
            value: false
          },

          presentAddress1: '',
          presentAddress2: '',
          presentZipCode: '',
          presentCity: '',
          presentState: '',

          permanentAddress1: '',
          permanentAddress2: '',
          permanentZipCode: '',
          permanentCity: '',
          permanentState: '',

          languagesknown: [
            {
              languageRequired: '',
              firstRead: '',
              firstWrite: '',
              firstSpeak: '',
            }],

          passportNumber: '',
          passportName: '',
          passportProfession: '',
          passportIssueDate: '',
          passportValid: '',
          passportIssuePlace: '',
          passportValidFor: '',

          illness: '',
          daysofIll: '',
          natureofIll: '',
          disability: '',
          height: '',
          weight: '',
          left: '',
          right: '',

          educationValuearray: [{
            field_level: {value: ''},
            field_board_university: {value: ''},
            field_institute: {value: ''},
            field_discipline: {value: ''},
            field_specification: {value: ''},
            field_year_of_passing: {value: ''},
            field_backlogs: {value: ''},
            field_percentage: {value: ''},
          }],

          familyValuesArr: [{
            names: '',
            dob: '',
            relationship: '',
            occupation: '',
          }],

          skillValueArray: [{ value: '' }],

          generalArray: [{
            names: '',

            relationship: '',

            position: '',

            company: '',
          },
          {
            names: '',

            relationship: '',

            position: '',

            company: '',
          }
          ],
          facultyReference1: '',
          facultyReference2: '',
        };

      }
    }, (error) => {

    });
  }

  edit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS);
  }
  onSubmit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_CONFIRM);
  }

}
