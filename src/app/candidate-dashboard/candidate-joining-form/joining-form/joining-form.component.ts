import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class JoiningFormComponent implements OnInit {

  activeStep: any = 'personal';
  valid = {
    personal: true,
    contact: false,
    dependent: false,
    education: false,
    upload: false,
    preview: false,
    submit: false,
    tillPersonal() {
      this.personal = true;
      this.contact = false;
      this.dependent = false;
      this.education = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
      },
      tillContact() {
        this.personal = true;
        this.contact = false;
        this.dependent = false;
        this.education = false;
        this.upload = false;
        this.preview = false;
        this.submit = false;
        },
      tilldependent() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
    }
  }

  routingSelection: any;
  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) {
    const subWrapperMenus = null;
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }


  ngOnInit() {
    this.statusOfForms();
  }

  statusOfForms() {
    this.candidateService.FormStatus().subscribe((data: any)=> {
      console.log('status', data);
      this.appConfig.hideLoader();
      if (data.dependent_details == '1') {
        this.valid.tilldependent();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
       return this.activeStep = 'education', this.routingSelection = 'education';
      }
      if (data.contact_details == '1') {
        this.valid.tillContact();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
        return this.activeStep = 'dependent', this.routingSelection = 'dependent';
      }
      if (data.personal_details == '1') {
        this.valid.tillPersonal();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
        return this.activeStep = 'contact', this.routingSelection = 'contact';
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
        return this.activeStep = 'personal', this.routingSelection = 'personal';
      }
    });
  }

  validCheck(clickedStep) {
    console.log('validcheck', clickedStep, this.routingSelection);
    
    if (clickedStep == 'personal') {
     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
    }
    if (clickedStep == 'contact') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
    }
    if (clickedStep == 'dependent') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
    }
    if (clickedStep == 'education') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
    
    // array.forEach(element => {
      
    // });
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
      
    // }
    for (const property in this.valid) {

      // console.log(`${property}: ${this.valid[property]}`);
    }
  }
}
