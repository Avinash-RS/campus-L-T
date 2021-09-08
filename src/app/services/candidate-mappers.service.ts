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
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
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
    .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
    .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  getUserId() {
    return this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
  }

  // For generating new static token for before login requests
  csrfToken() {
    return this.http.get(`${this.BASE_URL}/rest/session/token`, { headers: this.withoutTokens() });
  }
  getToken() {
    // this.csrfToken().subscribe((data: any) => {
    //
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
      { headers: this.withoutTokens(), withCredentials: true });
  }

  // For Image
  imageUpload(file, uniqueName) {

    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/file/upload/profile/candidate/field_profile_image?_format=json`, file,
      { headers: this.forImage(uniqueName), withCredentials: true });
  }

  // For profile Image
  profileUpload(file) {

    // this.datas is api body data
    // return this.http.post(`${this.BASE_URL}/profile/get_certificate_full_name`, file,
    //   { headers: this.withoutTokens(), withCredentials: true });

    return fetch(`${this.BASE_URL}/profile/get_certificate_full_name`, {
      method: 'POST',
      body: file,
      headers: new Headers({'userId': this.getUserId()}),
      // headers: this.getAfterCustomHeaders(), withCredentials: true
    });
  }

  // For Signature
  signatureUpload(file, uniqueName) {

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
    // return this.http.post(`${this.BASE_URL}/api/state_api`, Id, { headers: this.withoutTokens(), withCredentials: true });
    return this.http.get(`../assets/files/state.json`, { headers: this.withoutTokens(), withCredentials: true });
  }

  updatedCity(Id) {
    return this.http.post(`${this.BASE_URL}/api/city_api`, Id, { headers: this.withoutTokens(), withCredentials: true });
  }

  assessmentList(user) {
    return this.http.post(`${this.BASE_URL}/profile/hallticket`, user,
      {
        headers: this.getAfterCustomHeaders(),
        withCredentials: true
      });
  }

  uploadCandidateDocument(documentData) {
    // this.datas is api body data
    // return this.http.post(`${this.BASE_URL}/profile/upload_certificate`, documentData, { headers: this.getAfterCustomHeaders(), withCredentials: true });
    return fetch(`${this.BASE_URL}/profile/upload_certificate_new`, {
      method: 'POST',
      body: documentData,
      // headers: this.getAfterCustomHeaders(), withCredentials: true
    });

  }

  getListofDocs(data) {
    return this.http.post(`${this.BASE_URL}/profile/fileslist`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  //get dropdown value
  getEducationDropDown(userId) {
    return this.http.post(`${this.BASE_URL}/profile/candidate_education_level`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

  //save or submit uploaded file
  saveUploadDocument(data) {
    return this.http.post(`${this.BASE_URL}/profile/upload_certificates_id`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  //save or submit update file
  updateUploadDocument(data) {
    return this.http.post(`${this.BASE_URL}/profile/update_certificates_id`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  // getUploaded document
  getUploadedDocument(userId) {
    return this.http.post(`${this.BASE_URL}/profile/get_certificate`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getEducationList() {
    return this.http.get(`${this.BASE_URL}/api/education?_format=json`, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getDiplomaList(param) {
    return this.http.post(`${this.BASE_URL}/api/diploma_colleges?_format=json`, param, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getoverallInstitute() {
    return this.http.get(`${this.BASE_URL}/api/college_list`, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getoverallDiscipline() {
    return this.http.get(`${this.BASE_URL}/api/discipline_list`, { headers: this.withoutTokens(), withCredentials: true });
  }


  // education
  getoverallSpecialization() {
    return this.http.get(`${this.BASE_URL}/api/specification_list`, { headers: this.withoutTokens(), withCredentials: true });
  }

  removeCeritficate(data) {
    return this.http.post(`${this.BASE_URL}/profile/remove_certiticate`, data, { headers: this.withoutTokens(), withCredentials: true });
  }


    // Joining Form
    getBloodGroups() {
      return this.http.get(`${this.BASE_URL}/profile/bg_list`, { headers: this.withoutTokens(), withCredentials: true });
    }

    checkKycOrJoiningForm() {
      return true;
    }

    newGetProfileData(data) {
      return this.http.post(`${this.BASE_URL}/profile/get_candidate_form_details`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true});
    }

    saveAllProfileToLocal(profileData) {
      let saveasJson = JSON.stringify(profileData);
      this.appConfig.setLocalData('profileData', saveasJson);
    }

    getLocalProfileData() {
      let profile = this.appConfig.getLocalData('profileData') ? this.appConfig.getLocalData('profileData') : null;
      if (profile) {
        return JSON.parse(profile);
      }
      return null;
    }

    saveFormtoLocalDetails(formName, data) {
      let profile = this.getLocalProfileData();
      profile[formName] = data;
      let saveasJson = JSON.stringify(profile);
      this.appConfig.setLocalData('profileData', saveasJson);
    }

    getLocalpersonal_details() {
      let profile = this.getLocalProfileData();
      return profile ? profile.personal_details : null;
    }
    getLocalcontact_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.contact_details : null;
    }
    getLocaldependent_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.dependent_details : null;
    }
    getLocaleducation_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.education_details : null;
    }
    getLocaldocument_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.document_details : null;
    }
    getLocalexperience_details() {
      let profile = this.getLocalProfileData();
      return profile ? profile.experience_details : null;
    }
    getLocalsection_flags() {
      let profile = this.getLocalProfileData();
      return profile ? profile.section_flags : null;
    }
    getLocalform_name() {
      let profile = this.getLocalProfileData();
      return profile ? profile.form_name : null;
    }



    FormStatus() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/saved_details?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

    joiningFormGetPersonalDetails() {
     let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
      return this.http.get(`${this.BASE_URL}/profile/personal_pageload?user_id=${userId}`,
        { headers: this.getAfterCustomHeaders(), withCredentials: true});
    }

    joiningFormGetPersonalDetailsSave(data) {
      // let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
      return this.http.post(`${this.BASE_URL}/profile/personal_page`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
    }

    joiningFormGetContactDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/contact_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetContactDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/contact_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDependentDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/dependent_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDependentDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/dependent_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetWorkDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/employment_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetWorkDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/employment_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetEducationDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/education_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetEducationDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/education_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormDownloadableDocuments() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/joiningtemplate_downloads?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDocuments() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/uploaddocument_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDocumentsinv(uid) {
      let userId = uid;
       return this.http.get(`${this.BASE_URL}/profile/uploaddocument_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormUpload(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/uploaddocument_pagesave?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     uploadJoiningDocs(documentData) {
      // this.datas is api body data
      // return this.http.post(`${this.BASE_URL}/profile/upload_certificate`, documentData, { headers: this.getAfterCustomHeaders(), withCredentials: true });
      return fetch(`${this.BASE_URL}/profile/upload_joining_docs`, {
        method: 'POST',
        body: documentData,
        // headers: this.getAfterCustomHeaders(), withCredentials: true
      });

    }


     joiningFormGetPreviewDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/preview_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetPreviewDetailsCommon(userId) {
       return this.http.get(`${this.BASE_URL}/profile/preview_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormSubmit(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/submit_joiningform?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }


}
