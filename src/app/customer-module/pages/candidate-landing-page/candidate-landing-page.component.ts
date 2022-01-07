import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';

@Component({
  selector: 'app-candidate-landing-page',
  templateUrl: './candidate-landing-page.component.html',
  styleUrls: ['./candidate-landing-page.component.scss']
})
export class CandidateLandingPageComponent implements OnInit, OnDestroy {

  references: any;
  customerInfo: any;
  getCampusReferencesSubscription: Subscription;
  formSubmitted: any;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService
  ) { }

  ngOnInit() {
    this.appConfig.clearLocalDataOne('selected_customer');
    this.appConfig.clearLocalDataOne('driveList');
    this.appConfig.clearLocalDataOne('driveId');
    this.appConfig.clearLocalDataOne('profileData');
    this.appConfig.clearLocalDataOne('secondShortlist');
    this.appConfig.clearLocalDataOne('isEditAllowed');
    this.appConfig.clearLocalDataOne('showDocumentsTab');
    this.appConfig.clearLocalDataOne('joiningFormAccess');
    this.appConfig.clearLocalDataOne('firstShortlist');
    this.appConfig.clearLocalDataOne('form_submmited');
    this.appConfig.clearLocalDataOne('isKYCNotExempted');

    this.getReferenceAPI();
  }

  getReferenceAPI() {
    this.getCampusReferencesSubscription = this.adminService.getCampusReferences().subscribe((res: any)=> {
      this.references = res ? res : null;
      this.customerInfo = res && res.customers ? res.customers : '';
      this.customerInfo && this.customerInfo.length > 0 ? this.getActions(this.customerInfo) : '';
    }, (err)=> {

    });
  }

  getActions(customerInfo) {
    customerInfo.forEach((element, i) => {
      if (element && element.driveDetails && element.driveDetails.candidateStatus) {
        element.driveDetails.actions = [];
        let array = [];
        let startTime = element.driveDetails.candidateStatus && element.driveDetails.candidateStatus.interviewStartdate ? element.driveDetails.candidateStatus.interviewStartdate : '';
        let endTime = element.driveDetails.candidateStatus && element.driveDetails.candidateStatus.interviewEnddate ? element.driveDetails.candidateStatus.interviewEnddate : '';
        let status = element.driveDetails.candidateStatus && element.driveDetails.candidateStatus.interviewStatus ? element.driveDetails.candidateStatus.interviewStatus : '';
        element.driveDetails.candidateStatus.invStatus = this.isTimeExpired(startTime, endTime, status);
        let config = element.driveDetails.candidateStatus;
        if (config && (config.update_joining_form == 1 || config.update_joining_form == 2)) {
          element.driveDetails.candidateStatus && element.driveDetails.candidateStatus.interviewSchedule ? element.driveDetails.candidateStatus.interviewSchedule = 0 : '';
          config.update_joining_form == 1 ? array.push({label: 'Update Joining', value: 1}) : '';
          config.update_joining_form == 2 ? array.push({label: 'No Action Required', value: 2}) : '';
          this.formSubmitted = config.update_joining_form == 2 ? true : false;
        } else {
          if (config && (config.update_profile == 1 || config.update_profile == 2)) {
            config.update_profile == 1 ? array.push({label: 'Update Profile', value: 1}) : '';
            config.update_profile == 2 ? array.push({label: 'Profile Completed', value: 2}) : '';
            this.formSubmitted = config.update_profile == 2 ? true : false;
          }
          if (config && (config.upload_document == 1 || config.upload_document == 2)) {
            config.upload_document == 1 ? array.push({label: 'Upload Document', value: 1}) : '';
            config.upload_document == 2 ? array.push({label: 'Upload Document', value: 2}) : '';
          }
        }
        array.push({label: 'Update Profile', value: 2});
        element.driveDetails.actions1 = array;
        element.driveDetails.actions = array.filter(data => data.value == 1 );
      }
    });
  }

  customerSelection (customers: any, i: any, action: any) {
    let selectedCustomer = this.clone(customers);
    selectedCustomer.driveDetails = [selectedCustomer.driveDetails];
    this.setCustomerData(selectedCustomer).then((response: any)=> {
      if (action && action.label == 'Upload Document') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.DOCUMENT);
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING);
      }
    }).catch((err)=> {
      console.log(err);
    });
  }

  clone (src) {
    return JSON.parse(JSON.stringify(src));
}
 async setCustomerData(customer) {
   await this.appConfig.setLocalData('selected_customer', customer && customer['customer_code'] ? JSON.stringify(customer) : null);
   let data = customer.driveDetails[0] && customer.driveDetails[0].candidateStatus ? customer.driveDetails[0].candidateStatus : '';
   await this.setFormEditorNot(data);
  await this.appConfig.setLocalData('form_submmited', this.formSubmitted ? 'true' : 'false');
  await this.appConfig.setDriveList();
  }

  setFormEditorNot(data) {
    let isEditAllowed: Boolean = false;
    let showDocuments: any = false;
    this.appConfig.setLocalData('isKYCNotExempted', data && data['is_kyc_exempted'] && data['is_kyc_exempted'] == '1' ? 'false' : 'true');
    this.appConfig.setLocalData('joiningFormAccess', data && data['update_joining_form'] == '1' ? 'true' : 'false');
    if (data && (data['second_shortlist'] && data['second_shortlist'] == '1') && (data['update_joining_form'] != '1')) {
      showDocuments = true;
    }
    if (data && data['update_joining_form'] == '1') {
      isEditAllowed = true;
    } else {
      if ((data && data['is_kyc_exempted'] && data['is_kyc_exempted'] == '1')) {
        isEditAllowed = true;
      } else {
        if ((data && data['first_shortlist'] && data['first_shortlist'] != '1')) {
          isEditAllowed = true;
        }
      }
    }
    this.appConfig.setLocalData('isEditAllowed', isEditAllowed);
    this.appConfig.setLocalData('showDocumentsTab', showDocuments);
  }

  isTimeExpired(startTime, endTime, status) {
    let enableButton = '';
    var returned_startdate = moment(startTime).subtract(1, "hours");
    var returned_endate = moment(endTime).add(1, "hours");
    let isValidTime;
    if (returned_startdate && returned_endate) {
      isValidTime = moment(moment.now()).isBetween(
        returned_startdate,
        returned_endate
      );
    }
    if (isValidTime) {
      enableButton = status == 'Yet to Start' ? "Join Interview" : status == 'Completed' ? 'Completed' : 'Time Expired';
    } else {
      let custom = moment(returned_endate).diff(moment.now(), "minutes");
      if (custom > 0) {
        enableButton = status == 'Yet to Start' ? "Yet to Start" : status == 'Completed' ? 'Completed' : 'Time Expired';
      } else {
        enableButton = status == 'Yet to Start' ? "Time Expired" : status == 'Completed' ? 'Completed' : 'Time Expired';
      }
    }
    return enableButton;
  }

  ngOnDestroy() {
    this.getCampusReferencesSubscription ? this.getCampusReferencesSubscription.unsubscribe() : '';
  }
}
