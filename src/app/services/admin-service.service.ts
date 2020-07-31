import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  BASE_URL = environment.API_BASE_URL;
  httpOptions: { headers: HttpHeaders };


  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      // .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  getAfterCustomHeadersWithBasicAuth(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
    return headers;
  }

  getCustomHeadersWithBasicAuthWithHalContentType(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/hal+json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
    return headers;
  }



  getAfterCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  withoutTokens(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  onlyToken(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }


  // For generating new static token for before login requests
  csrfToken() {
    return this.http.get(`${this.BASE_URL}/rest/session/token`, { headers: this.withoutTokens() });
  }
  getToken() {
    // this.csrfToken().subscribe((data: any) => {
    //   this.appConfig.hideLoader();
    //   // localStorage.setItem('csrf', data);
    // }, (err) => {
    //   if (err.status === 200) {
    //     this.appConfig.setSessionData('csrf', err.error.text);
    //   }
    // });
  }

  // Users List
  userList() {
    return this.http.get(`${this.BASE_URL}/admin/user-list?_format=json`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Add User
  addUser(formdata) {
    return this.http.post(`${this.BASE_URL}/entity/user?_format=hal_json`, formdata,
      { headers: this.getAfterCustomHeadersWithBasicAuth(), withCredentials: true });
  }

  // Edit User
  editUser(formdata, UserId) {
    return this.http.patch(`${this.BASE_URL}/user/${UserId}?_format=hal_json`, formdata,
      {
        headers: this.getCustomHeadersWithBasicAuthWithHalContentType(),
        withCredentials: true
      });
  }

  // Delete User
  deleteUser(UserId) {
    return this.http.delete(`${this.BASE_URL}/user/${UserId}?_format=hal_json`,
      {
        headers: this.getAfterCustomHeadersWithBasicAuth(),
        withCredentials: true
      });
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/lost-password?_format=json`, email,
      { withCredentials: true });
  }


  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  instituteListForApprovals() {
    return this.http.get(`${this.BASE_URL}/api/institute_adminstatus?_format=json`,
      { headers: this.withoutTokens(), withCredentials: true });
  }
  instituteListAfterBulkUpload() {
    return this.http.get(`${this.BASE_URL}/api/institute_list`,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  approveOrReject(data) {
    return this.http.post(`${this.BASE_URL}/api/institute_update`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }


  // HR APIS
  getCandidateListForShortlist() {
    return this.http.get(`${this.BASE_URL}/profile/getprofileshortlist`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  submitAllFilters(data) {
    return this.http.post(`${this.BASE_URL}/profile/first_shortlist`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  firstLevelReject(data) {
    return this.http.post(`${this.BASE_URL}/profile/reject_shortlist_user`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  submitShortlistedCandidates(data) {
    return this.http.post(`${this.BASE_URL}/profile/shortlist_user`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  alreadyUploadedDetails() {
    return this.http.get(`${this.BASE_URL}/profile/user_details_get`,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  uploadCSV(data) {
    return this.http.post(`${this.BASE_URL}/api/bulk-user/registration?_format=json`, data,
      { headers: this.onlyToken(), withCredentials: true });
  }

  secondLevelReports() {
    return this.http.get(`${this.BASE_URL}/profile/assement_report`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  firstLevelReports() {
    return this.http.get(`${this.BASE_URL}/profile/admin_report`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadCandidates(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_create_progm`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadCandidatesErrorList() {
    return this.http.get(`${this.BASE_URL}/profile/getuploaded_errors`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadInstitutes(data) {
    return this.http.post(`${this.BASE_URL}/api/institute_create`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
  // hrAdd User
  hrAddUser(formdata) {
    return this.http.post(`${this.BASE_URL}/profile/interview_panel_create`, formdata,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
  //hr user list
  hruserList() {
    return this.http.get(`${this.BASE_URL}/profile/interview_panel_users`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getDiscipline() {
    return this.http.get(`${this.BASE_URL}/profile/getdiscipline`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hrremove user
  hrDeleteUser(userId) {
    return this.http.post(`${this.BASE_URL}/profile/interview_panel_unblock`, userId,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Test results upload for 2nd level shortlist
  testResultsUpload(data) {
    return this.http.post(`${this.BASE_URL}/profile/first_shortlist_assement`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlist
  assessmentListForSecondLevelShortlist() {
    return this.http.get(`${this.BASE_URL}/profile/first_shortlist_report`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlist canidate filter header Details
  assessmentDetailsOfSecond(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_secondshortlit_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlist api
  secondShortlistAPI(data) {
    return this.http.post(`${this.BASE_URL}/profile/update_assement_shortlist`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlisted candidates report api
  shortlistedCandidatesReport(data) {
    return this.http.post(`${this.BASE_URL}/profile/getassement_candidate_shortlist`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlist canidate filter page
  filterSecondLevel(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_secondshortlit_candidate_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // TPO API's
  tpoCandidateListAfterBulkUpload(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_details_get`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  tpoBulkMailSent(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_email_sent`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  TPOStatusShortlistLists() {
    return this.http.get(`${this.BASE_URL}/profile/shortlist_details`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  TPOStatusFolderLists() {
    return this.http.get(`${this.BASE_URL}/profile/getfolder_name`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  TPOStatusTagLists() {
    return this.http.get(`${this.BASE_URL}/profile/user_field_tag`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getTPOStatus(data) {
    return this.http.post(`${this.BASE_URL}/profile/getassement_details`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }


  // Interview panel role apis
  interviewPanelShortlist() {
    return this.http.get(`${this.BASE_URL}/api/institute_candidate_shortlist?_format=json`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  interviewPanelShortlist2() {
    return this.http.get(`${this.BASE_URL}/api/interview_panel`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // getting evaluation user data
  getEvaluationData(data) {
    return this.http.post(`${this.BASE_URL}/api/evaluation_data`, data,
    { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
  postEvaluationCandidateData(data) {
    return this.http.post(`${this.BASE_URL}/api/evaluation_form`, data,
    { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
}
