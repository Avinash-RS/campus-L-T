import { Component, OnInit } from '@angular/core';
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
  ]
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getUserDetails();
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

  getUserDetails() {
    this.candidateService.getUserProfile().subscribe((data: any) => {
      console.log(data[0]);
      this.userDetails = data[0];
      const organizeUserDetails = data[0];

      // Changing Dob Date Format
      let dob;
      const dobFormats = organizeUserDetails && organizeUserDetails.field_dob && organizeUserDetails.field_dob[0].value ? organizeUserDetails.field_dob[0].value : 'NA';
      if (dobFormats) {
        const split = moment(dobFormats).format('DD/MM/YYYY').split('/');
        dob = {
          date: split[0],
          month: split[1],
          year: split[2],
        };
      } else {
        dob = {
          date: 'NA',
          month: 'NA',
          year: 'NA',
        };
      }

      this.userDetails = {
        name: organizeUserDetails && organizeUserDetails.field_name && organizeUserDetails.field_name[0] ? organizeUserDetails.field_name[0].value : 'NA',
        mail: organizeUserDetails && organizeUserDetails.field_email && organizeUserDetails.field_email[0] ? organizeUserDetails.field_email[0].value : 'NA',
        mobile: organizeUserDetails && organizeUserDetails.field_mobile && organizeUserDetails.field_mobile[0] ? organizeUserDetails.field_mobile[0].value : 'NA',
        gender: organizeUserDetails && organizeUserDetails.field_gender && organizeUserDetails.field_gender[0] ? organizeUserDetails.field_gender[0].value : 'NA',
        marital: organizeUserDetails && organizeUserDetails.field_mariatal_status && organizeUserDetails.field_mariatal_status[0] ? organizeUserDetails.field_mariatal_status[0].value : 'NA',
        dob: {
          date: dob.date,
          month: dob.month,
          year: dob.year
        },
        nationality: organizeUserDetails && organizeUserDetails.field_nationality && organizeUserDetails.field_nationality[0] ? organizeUserDetails.field_nationality[0].value : 'NA',
        category: organizeUserDetails && organizeUserDetails.field_category && organizeUserDetails.field_category[0] ? organizeUserDetails.field_category[0].value : 'NA',
        presentAddress: {
          address1: organizeUserDetails && organizeUserDetails.field_present_line_street_addres && organizeUserDetails.field_present_line_street_addres[0] ? organizeUserDetails.field_present_line_street_addres[0].value : '',
          address2: organizeUserDetails && organizeUserDetails.field_present_line2_street_addre && organizeUserDetails.field_present_line2_street_addre[0] ? organizeUserDetails.field_present_line2_street_addre[0].value : '',
          postalCode: organizeUserDetails && organizeUserDetails.field_present_zip && organizeUserDetails.field_present_zip[0] ? organizeUserDetails.field_present_zip[0].value : '',
          city: organizeUserDetails && organizeUserDetails.field_preset_city && organizeUserDetails.field_preset_city[0] ? organizeUserDetails.field_preset_city[0].value : '',
          state: organizeUserDetails && organizeUserDetails.field_present_state && organizeUserDetails.field_present_state[0] ? organizeUserDetails.field_present_state[0].value : ''
        },
        permanentAddress: {
          address1: organizeUserDetails && organizeUserDetails.field_permanent_line1_street_add && organizeUserDetails.field_permanent_line1_street_add[0] ? organizeUserDetails.field_permanent_line1_street_add[0].value : '',
          address2: organizeUserDetails && organizeUserDetails.field_permanent_line2_street_add && organizeUserDetails.field_permanent_line2_street_add[0] ? organizeUserDetails.field_permanent_line2_street_add[0].value : '',
          postalCode: organizeUserDetails && organizeUserDetails.field_permanent_zip && organizeUserDetails.field_permanent_zip[0] ? organizeUserDetails.field_permanent_zip[0].value : '',
          city: organizeUserDetails && organizeUserDetails.field_permanent_city && organizeUserDetails.field_permanent_city[0] ? organizeUserDetails.field_permanent_city[0].value : '',
          state: organizeUserDetails && organizeUserDetails.field_permanent_state && organizeUserDetails.field_permanent_state[0] ? organizeUserDetails.field_permanent_state[0].value : ''
        },
        languagesknown: [
          {
            name: organizeUserDetails && organizeUserDetails.field_language_known && organizeUserDetails.field_language_known[0] ? organizeUserDetails.field_language_known[0].value : 'NA',
            read: 'read',
            write: '',
            speak: ''
          }],

        passportNumber: organizeUserDetails && organizeUserDetails.field_passport_number && organizeUserDetails.field_passport_number[0] ? organizeUserDetails.field_passport_number[0].value : 'NA',
        passportName: organizeUserDetails && organizeUserDetails.field_name_as_in_passport && organizeUserDetails.field_name_as_in_passport[0] ? organizeUserDetails.field_name_as_in_passport[0].value : 'NA',
        passportProfession: organizeUserDetails && organizeUserDetails.field_profesiona_as_passport && organizeUserDetails.field_profesiona_as_passport[0] ? organizeUserDetails.field_profesiona_as_passport[0].value : 'NA',
        passportDate: organizeUserDetails && organizeUserDetails.field_date_of_issue && organizeUserDetails.field_date_of_issue[0] ? this.getDateFormat(organizeUserDetails.field_date_of_issue[0].value) : 'NA',
        passportValid: organizeUserDetails && organizeUserDetails.field_valid_upto && organizeUserDetails.field_valid_upto[0] ? this.getDateFormat(organizeUserDetails.field_valid_upto[0].value) : 'NA',
        passportPlace: organizeUserDetails && organizeUserDetails.field_place_of_issue && organizeUserDetails.field_place_of_issue[0] ? organizeUserDetails.field_place_of_issue[0].value : 'NA',
        passportCountries: organizeUserDetails && organizeUserDetails.field_country_valid_for && organizeUserDetails.field_country_valid_for[0] ? organizeUserDetails.field_country_valid_for[0].value : 'NA',

        healthRecentIllness: organizeUserDetails && organizeUserDetails.field_serious_illness && organizeUserDetails.field_serious_illness[0] ? organizeUserDetails.field_serious_illness[0].value : 'NA',

        healthIllnessDays: organizeUserDetails && organizeUserDetails.field_no_of_days && organizeUserDetails.field_no_of_days[0] ? organizeUserDetails.field_no_of_days[0].value : 'NA',

        healthNature: organizeUserDetails && organizeUserDetails.field_nature_of_illness && organizeUserDetails.field_nature_of_illness[0] ? organizeUserDetails.field_nature_of_illness[0].value : 'NA',

        healthDisability: organizeUserDetails && organizeUserDetails.field_physical_disability && organizeUserDetails.field_physical_disability[0] ? organizeUserDetails.field_physical_disability[0].value : 'NA',

        healthHeight: organizeUserDetails && organizeUserDetails.field_height && organizeUserDetails.field_height[0] ? organizeUserDetails.field_height[0].value : 'NA',

        healthWeight: organizeUserDetails && organizeUserDetails.field_weight && organizeUserDetails.field_weight[0] ? organizeUserDetails.field_weight[0].value : 'NA',

        healthPowerLeft: organizeUserDetails && organizeUserDetails.field_left_eyepower_glass && organizeUserDetails.field_left_eyepower_glass[0] ? organizeUserDetails.field_left_eyepower_glass[0].value : 'NA',

        healthPowerRight: organizeUserDetails && organizeUserDetails.field_right_eye_power_glass && organizeUserDetails.field_right_eye_power_glass[0] ? organizeUserDetails.field_right_eye_power_glass[0].value : 'NA',


      };
      console.log(this.userDetails);

      this.appConfig.hideLoader();
    }, (error) => {

    });
  }

  onSubmit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_CONFIRM);
  }
}
