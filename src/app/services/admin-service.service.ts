import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  BASE_URL = environment.API_BASE_URL;
  WEBRTC_NODE_API = environment.WEBRTC_NODE_API;
  NODE_API = environment.NODE_API_BASE_URL;
  PROCTOR_URL = environment.PROCTOR_URL;
  UNIFIEDREPORTSAPI = environment.UNIFIEDREPORTSAPI;
  httpOptions: { headers: HttpHeaders };


  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  proctorToken(): HttpHeaders {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Authorization', ('Bearer ' + (this.appConfig.getLocalData('Proctor_token') ? this.appConfig.getLocalData('Proctor_token') : '')));
      return headers;
    }
  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  getAfterCustomHeadersDummy(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  withoutTokens(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  onlyToken(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  // Reference API
  getCampusReferences() {
    return this.http.get(`${this.BASE_URL}/profile/candidateDashboard`, { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Users List
  userList() {
    return this.http.get(`${this.BASE_URL}/profile/get_hrs_list`,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
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
      { headers: this.withoutTokens(), reportProgress: true, withCredentials: true });
  }
  instituteListAfterBulkUpload() {
    return this.http.get(`${this.BASE_URL}/api/institute_list`,
      { headers: this.withoutTokens(), reportProgress: true, withCredentials: true });
  }

  approveOrReject(data) {
    return this.http.post(`${this.BASE_URL}/api/institute_update`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }


  // HR APIS
  // getCandidateListForShortlist(data) {
  //   return this.http.post(`${this.BASE_URL}/profile/getprofileshortlist_quicker`, data,
  //     { headers: this.getAfterCustomHeaders(), withCredentials: true });
  // }

  getCandidateListForShortlist(data) {
    return this.http.post(`${this.BASE_URL}/profile/first_level_shortlisting_candidates`, data,
      { headers: this.getAfterCustomHeadersDummy(), reportProgress:true, withCredentials: true });
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

  alreadyUploadedDetails(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_details_get`, data,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  getCandidatesList(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_candidates_list`, data,
      { headers: this.withoutTokens(), withCredentials: true, reportProgress: true });
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
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  bulkUploadCandidates(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_create_progm`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadCandidatesErrorList(data) {
    return this.http.post(`${this.BASE_URL}/profile/getuploaded_errors`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadInstitutesErrorList() {
    return this.http.get(`${this.BASE_URL}/api/getuploaded_errors_institute`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  UploadTestReports() {
    return this.http.get(`${this.BASE_URL}/profile/assement_errors`,
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

  // hr Interview panel bulk create
  invBulk(formdata) {
    return this.http.post(`${this.BASE_URL}/profile/interview_panel_create_only`, formdata,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // hr Interview panel bulk create
  invBulkReports() {
    return this.http.get(`${this.BASE_URL}/profile/getuploaded_errors_interview_panel`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hr user list
  hruserList() {
    return this.http.get(`${this.BASE_URL}/profile/interview_panel_users`,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  getDiscipline() {
    return this.http.get(`${this.BASE_URL}/profile/getdiscipline`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //get tag name
  getTagName() {
    return this.http.get(`${this.BASE_URL}/api/report_details`,
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
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  // 2nd level shortlist api
  secondShortlistAPI(data) {
    return this.http.post(`${this.BASE_URL}/profile/update_assement_shortlist`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // 2nd level shortlisted candidates report api
  shortlistedCandidatesReport(data) {
    return this.http.post(`${this.BASE_URL}/profile/getassement_candidate_shortlist`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  // 2nd level shortlist canidate filter page
  filterSecondLevel(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_secondshortlit_candidate_report`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  // Hr Evaluation landing screen
  hrEvaluationAssessmentDetails() {
    return this.http.get(`${this.BASE_URL}/api/institute_candidate_shortlist`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // inv Evaluation landing screen
  invEvaluationAssessmentDetails(data) {
    return this.http.post(`${this.BASE_URL}/api/institute_candidate_shortlist_evaluation_screen`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Hr evaluation particular assessment status
  hrEvaluationParticularAssessmentDetails(data) {
    return this.http.post(`${this.BASE_URL}/profile/candidatelist_evaluation`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Hr evaluation particular assessment header
  hrEvaluationParticularAssessmentDetailsHeader(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_secondshortlit_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

    // Hr evaluation particular assessment header
    hrEvaluationParticularAssessmentDetailsHeader_CandidateParamAdded(data) {
      return this.http.post(`${this.BASE_URL}/profile/assement_secondshortlit_report`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true });
    }


  // Hr evaluation particular assessment header
  hrEvaluationSectionMarks(data) {
    return this.http.post(`${this.BASE_URL}/profile/marks_by_user`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Hr evaluation get eduction certificates
  getCertificates(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_certificate`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Profile View
  getProfileView(data) {
    return this.http.get(`${this.BASE_URL}/kyc_views/${data}?_format=json`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Resubmit certificate request
  reSubmitRequest(data) {
    return this.http.post(`${this.BASE_URL}/profile/changecertificate`, data,
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

  TPOStatusTagLists(data) {
    return this.http.post(`${this.BASE_URL}/profile/user_field_tag`, data,
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

  // getting evaluation details
  getEvaluationDetails(data) {
    data.form = this.appConfig.getSelectedDriveFormDetails().id;
    return this.http.post(`${this.BASE_URL}/api/evaluation_form_result`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
  getAdaniEvaluationDetails(data) {
    data.form = this.appConfig.getSelectedDriveFormDetails().id;
    return this.http.post(`${this.BASE_URL}/evaluation/get-evaluation-feedback`, data,
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

  // Submitting Form
  postEvaluationCandidateData(data) {
    return this.http.post(`${this.BASE_URL}/api/evaluation_form`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  postEvaluationAdaniCandidateData(data) {
    return this.http.post(`${this.BASE_URL}/evaluation/save-evaluation-feedback`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Submitting Form
  invSubmittingCandidates(data) {
    return this.http.post(`${this.BASE_URL}/profile/update_evaluation_status`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Submitted Candidates List
  invSubmittedCandidatesList(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_candidate_hrassigned_evaluation`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  adaniInvSubmittedCandidatesList() {
    return this.http.get(`${this.BASE_URL}/evaluation/get-assigned-candidates`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // get assessment details
  getHrEvaluationInterviewPanel() {
    return this.http.get(`${this.BASE_URL}/api/institute_candidate_shortlist`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

    // get assessment details
    getHrEvaluationInterviewPanelHeader(data) {
      return this.http.post(`${this.BASE_URL}/api/institute_candidate_shortlist`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true });
    }


  // based on assessment get candidate details
  getEvaluationCandidateData(data) {
    return this.http.post(`${this.BASE_URL}/Profile/interviewpanel_secondshortlit_candidate_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //get interview panel details
  getInterviewPanelDetails() {
    return this.http.get(`${this.BASE_URL}/profile/interview_panel_users_only`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //get interview panel form list
  getInterviewPanelFormlist() {
    return this.http.get(`${this.BASE_URL}/profile/formlists`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //assign candidate to interview panel
  assignCandidateTOPanel(data) {
    return this.http.post(`${this.BASE_URL}/Profile/evaluation_hr_assign`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getAllShortlistedShortlistNames() {
    return this.http.get(`${this.BASE_URL}/profile/shortlisted_names_list`, { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getAllShortlistedShortlistNames_ALL() {
    return this.http.get(`${this.BASE_URL}/profile/shortlisted_names_list?list=all`, { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hr 1st sortlist report list
  firstSortlistReportslist(data){
    return this.http.post(`${this.BASE_URL}/reports/applicants_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

   //hr interview panel report list
   interviewPanelReportslist(data){
    return this.http.post(`${this.BASE_URL}/reports/interview_panel_users_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //get assessment names
  getAllAssessmentNames(){
    return this.http.get(`${this.BASE_URL}/api/allassesment`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hr 2nd shortlist report list
  secondShortlistReport(data){
    return this.http.post(`${this.BASE_URL}/reports/shortlists_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hr 3rd shortlist report list
  assessmentFeedbackReport(data){
    data.form_id = this.appConfig.getSelectedDriveFormDetails().id;
    return this.http.post(`${this.BASE_URL}/reports/evaluation_feedback_report`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  //hr 1st shortlist excel download
  firstShortlistExcelDownload(data){
    return this.http.post(`${this.BASE_URL}/profile/excel_download`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // hr status download
  getStatusExcelDownload(data) {
    return this.http.post(`${this.BASE_URL}/profile/getassement_excel`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // hr shortlist base candidate
  getShortlistCandidateList(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_select`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // hr scheduling assessment
  schedulingAssessment(data) {
    return this.http.post(`${this.BASE_URL}/profile/assement_insert`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }


  getInterviewpanelInstitutes() {
    return this.http.get(`${this.BASE_URL}/profile/getall_institue_assement`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getParticularInterviewpanelist(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_interview_pan_by_discipline`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getParticularInterviewpanelistWithoutLoader(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_interview_pan_by_discipline`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  getParticularCandidatelist(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_candidate_for_assement`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  getCandidateInterviewResult(data) {
    return this.http.post(`${this.BASE_URL}/evaluation/get-all-evaluation-feedbacks`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }
  submitHRResultOnCandidates(data) {
    return this.http.post(`${this.BASE_URL}/evaluation/processing-feedbacks`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  assignToHR(data) {
    return this.http.post(`${this.BASE_URL}/profile/evaluation_hr_assign`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  getAlreadyAssigned(data) {
    return this.http.post(`${this.BASE_URL}/profile/get_candidate_hrassigned`, data,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  bulkUploadInvAssign(data) {
    return this.http.post(`${this.BASE_URL}/profile/evaluation_hr_assign_bulk_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  AssignedPanelistRemoval(data) {
    return this.http.post(`${this.BASE_URL}/evaluation/remove-panel-members`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  bulkUploadInvAssignReports() {
    return this.http.get(`${this.BASE_URL}/profile/evaluation_assignment_errors`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  evalationReportAPI() {
    return this.http.get(`${this.BASE_URL}/profile/evaluation_institute_list`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }
  shortlist2ReportAPI() {
    return this.http.get(`${this.BASE_URL}/profile/assement_institute_list`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  keyMastersList() {
    return this.http.get(`${this.BASE_URL}/profile/master_list`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  workExperienceList(uid) {
    return this.http.post(`${this.BASE_URL}/profile/emp_work_experience?user_id=${uid.user_id}`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  SelectedCandidatesBulkUpload(data) {
    return this.http.post(`${this.BASE_URL}/profile/selected_user_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  SelectedCandidatesHRMappingBulkUpload(data) {
    return this.http.post(`${this.BASE_URL}/profile/selected_user_ps_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  PMECDetailsBulkUpload(data) {
    return this.http.post(`${this.BASE_URL}/bulk-upload/PEMC_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  OfferDetailsBulkUpload(data) {
    return this.http.post(`${this.BASE_URL}/bulk-upload/Offer_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  declinedCandidatesUpload(data) {
    return this.http.post(`${this.BASE_URL}/profile/decliners_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  SelectedCandidatesList(data) {
    return this.http.get(`${this.BASE_URL}/profile/selected_user_list?company=${data.company}`,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  SelectedCandidatesBulkUploadErrorList() {
    return this.http.get(`${this.BASE_URL}/profile/selected_user_error_list`,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  documentsDownload(data) {
    return this.http.post(`${this.BASE_URL}/profile/pdf_select_download`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Download profile doc

  getprofileDoc(uid){
    return this.http.get(`${this.BASE_URL}/doc-download/eaf_download?user_id=${uid}`,
    { headers: this.getAfterCustomHeaders(), withCredentials: true});
  }

  addIC(data) {
    return this.http.post(`${this.BASE_URL}/profile/ic_panel_upload`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  listOfICs() {
    return this.http.get(`${this.BASE_URL}/profile/ic_list`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  listIC() {
    return this.http.get(`${this.BASE_URL}/profile/ic_panel_list`,
      { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
  }

  // Send email to selected candidates and edit access for joining form
  sendMailOrEditAccess(data, option) {
    return this.http.post(`${this.BASE_URL}/profile/joining_mail?mail=${option}`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Excel export of selected candidates
  excelExportSelectedCandidates(data) {
    return this.http.post(`${this.BASE_URL}/profile/Joining_export`, data,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  documentVerification(data) {
      return this.http.post(`${this.BASE_URL}/profile/document_verification`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

// Node service urls

scheduleRooms(data) {
  return this.http.post(`${this.WEBRTC_NODE_API}/scheduleinterview`, data, {headers: this.withoutTokens(), reportProgress: true, withCredentials: false});
}
getScheduledList(data) {
  return this.http.post(`${this.WEBRTC_NODE_API}/getscheduleList`, data, {headers: this.withoutTokens(), withCredentials: false});
}

getDummyJson() {
  return this.http.get('../../assets/files/sample.json');
}

getCandidateAssessmentResults(data) {
  return this.http.post(`${this.BASE_URL}/profile/marks_by_user`, data,
  { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

// Video Scheduling apis
getInterviewersBasedOnShortlistName(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/interviewers-list`, {shortlist_name: data}, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

// Video Scheduling apis
getCandidatesBasedOnShortlistName(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/candidates-list`, {shortlist_name: data}, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

getQuestionsForVideoScheduling() {
  return this.http.get(`${this.NODE_API}/videoAssessmentQuestionmaster`, {headers: this.withoutTokens(), reportProgress: true, withCredentials: false});
}

VideoSchedulingSubmit(data) {
  return this.http.post(`${this.NODE_API}/videoAssessmentSchedule`, data, {headers: this.withoutTokens(), withCredentials: false});
}

// Proctor
getProctorVideo(id,type){
  return this.http.get(`${this.PROCTOR_URL}/api/chat/`+id+`?limit=20&count=1&filter[type]=`+type, {headers: this.proctorToken(), withCredentials: false});
}

getproctorToken(data) {
  return this.http.post(`${this.PROCTOR_URL}/api/auth/login`, data, {headers: this.withoutTokens(), withCredentials: false});
}

ViewSchedulingDetails(data) {
  return this.http.post(`${this.NODE_API}/scheduledQuestionDetails`, data, {headers: this.withoutTokens(), reportProgress: true, withCredentials: false});
}

saveVideoSchedulingFeedBack(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/save-feedback`, data, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

viewScheduleDetails(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/scheduled-list`, data, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

scheduledVideoReports(data) {
  return this.http.post(`${this.BASE_URL}/reports/va-scheduled-report`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

evaluatedVideoReports(data) {
  return this.http.post(`${this.BASE_URL}/reports/va-feedback-report`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

VideoAssessmentAssignToEvaluator(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/assign-va-evaluation`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

assignedVAEvaluationListForEvaluators() {
  return this.http.get(`${this.BASE_URL}/video-assessment/assigned-va-evaluation-list`, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

videoAssessmentEvaluationDetails(data) {
  return this.http.post(`${this.BASE_URL}/video-assessment/va-evaluation-detail`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

getHRDashboardSummaryAPI() {//2
  return this.http.get(`${this.BASE_URL}/dashboard/drive_summary?drive_id=${this.appConfig.getDriveId()}`, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

getTPODashboardSummaryAPI() {//6
  return this.http.get(`${this.BASE_URL}/dashboard/tpo_based_count?drive_id=${this.appConfig.getDriveId()}`, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

getDisciplineDashboardSummaryAPI() {//6
  return this.http.get(`${this.BASE_URL}/dashboard/shortlist_summary?drive_id=${this.appConfig.getDriveId()}`, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

getBUunitSummaryAPI() {//6
  return this.http.get(`${this.BASE_URL}/dashboard/businessunit_summary?drive_id=${this.appConfig.getDriveId()}`, { headers: this.getAfterCustomHeaders(), reportProgress: true, withCredentials: true });
}

getSkills(data) {
  return this.http.post(`${this.UNIFIEDREPORTSAPI}/getSkill`,data, {headers: this.withoutTokens(), reportProgress: true, withCredentials: false});
}

postSkills(data) {
  return this.http.post(`${this.UNIFIEDREPORTSAPI}/addSkill`,data, {headers: this.withoutTokens(), reportProgress: true, withCredentials: false});
}

miscCollegeList(data) {
  return this.http.post(`${this.BASE_URL}/college/getCollegeList`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

miscAddCollege(data) {
  return this.http.post(`${this.BASE_URL}/college/addCollege`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

miscCheckEmail(data) {
  return this.http.post(`${this.BASE_URL}/miscellaneous/getCandidateDetails`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

miscChangeCandidateName(data) {
  return this.http.post(`${this.BASE_URL}/miscellaneous/editUserName`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
}

}
