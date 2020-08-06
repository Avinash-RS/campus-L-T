import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateMappersService {
  BASE_URL = environment.API_BASE_URL;

  httpOptions: { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }


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

  getAfterCustomHeadersWithMultiPart(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    })
      .set('Content-Type', 'multipart/form-data')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  forImage(uniqueName): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/octet-stream')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      // tslint:disable-next-line: quotemark
      .set('Content-Disposition', `filename="${uniqueName}"`)
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
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

  // Edit User Profile
  editUser(formdata) {
    // return this.http.post(`${this.BASE_URL}/entity/profile?_format=json`, formdata,
    return this.http.post(`${this.BASE_URL}/profile/updateprofile`, formdata,
      {
        // headers: this.getAfterCustomHeadersWithBasicAuth(),
        headers: this.withoutTokens(),
        withCredentials: true
      });
  }

  // Get user Prifule
  getUserProfile() {
    return this.http.get(`${this.BASE_URL}/candidate-page?_format=json`,
      {
        headers: this.getAfterCustomHeaders(),
        withCredentials: true
      });
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/lost-password?_format=json`, email,
      { withCredentials: true });
  }

  // For Image
  imageUpload(file, uniqueName) {
    console.log(uniqueName);

    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/file/upload/profile/candidate/field_profile_image?_format=json`, file,
      { headers: this.forImage(uniqueName), withCredentials: true });
  }

  // For Signature
  signatureUpload(file, uniqueName) {
    console.log(uniqueName);

    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/file/upload/profile/candidate/field_signature?_format=json`, file,
      { headers: this.forImage(uniqueName), withCredentials: true });
  }

  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  updatedState(Id) {
    return this.http.post(`${this.BASE_URL}/api/state_api`, Id, { headers: this.withoutTokens(), withCredentials: true });
  }

  updatedCity(Id) {
    return this.http.post(`${this.BASE_URL}/api/city_api`, Id, { headers: this.withoutTokens(), withCredentials: true });
  }

  assessmentList() {
    return this.http.get(`${this.BASE_URL}/profile/hallticket`,
      {
        headers: this.getAfterCustomHeaders(),
        withCredentials: true
      });
  }

  uploadCandidateDocument(documentData) {
    // this.datas is api body data
    // return this.http.post(`${this.BASE_URL}/profile/upload_certificate`, documentData, { headers: this.getAfterCustomHeaders(), withCredentials: true });
    return fetch(`${this.BASE_URL}/profile/upload_certificate`, {
      method: 'POST',
      body: documentData,
      // headers: this.getAfterCustomHeaders(), withCredentials: true
    });

  }

  //get dropdown value
  getEducationDropDown(userId) {
    return this.http.post(`${this.BASE_URL}/profile/candidate_education_level`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

  //save or submit uploaded file
  saveUploadDocument(data) {
    return this.http.post(`${this.BASE_URL}/profile/upload_certificates_id`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  //getUploaded document
  getUploadedDocument(userId) {
    return this.http.post(`${this.BASE_URL}/profile/get_certificate`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

}
