import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  BASE_URL = environment.API_BASE_URL;
  BASE_URL_CITY = environment.API_BASE_URL_city;
  httpOptions: { headers: HttpHeaders; };
  EncryptKEY = environment.cryptoEncryptionKey;


  //  --proxy-config proxy.conf.json
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      // .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }
  getAfterCustomHeaders(): HttpHeaders {
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
  withoutTokens(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
    .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
    .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
    .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
    .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  // For generating new static token for before login requests
  csrfToken() {
    return this.http.get(`${this.BASE_URL}/rest/session/token`, { headers: this.withoutTokens() });
  }
  getToken() {
    // this.csrfToken().subscribe((data: any) => {
    //   console.log(data);

    //
    //   // localStorage.setItem('csrf', data);
    // }, (err) => {
    //   if (err.status === 200) {
    //     this.appConfig.setSessionData('csrf', err.error.text);
    //   }
    // });
  }
  // Registration
  RegistrationForm(formdata) {
    return this.http.post(`${this.BASE_URL}/api/institute_create`, formdata,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  CandidateRegistrationForm(formdata) {
    return this.http.post(`${this.BASE_URL}/rest/create-account?_format=json`, formdata,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  emailVerification(data) {
    return this.http.post(`${this.BASE_URL}/rest/verify-account?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // To get all cities
  getAllCity() {
    return this.http.get(`${this.BASE_URL_CITY}/cities.php`, { headers: this.withoutTokens() });
  }

  // To get all cities
  getAllState() {
    return this.http.get(`${this.BASE_URL_CITY}/states.php`, { headers: this.withoutTokens() });
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/lost-password?_format=json`, email,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  passwordTokenVerification(data) {
    return this.http.post(`${this.BASE_URL}/rest/verify-password?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Reset Password
  passwordReset(data) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/lost-password-reset?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Login
  login(loginData) {
    return this.http.post(`${this.BASE_URL}/user/login?_format=json`, loginData,
      { headers: this.withoutTokens(), withCredentials: true });

  }

  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  getEmailDecryption(data){
    return this.http.post(`${this.BASE_URL}/profile/email_decryption_service`, data,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  getStatus() {
    return this.http.get(`${this.BASE_URL}/profile/fetch_maintance_status`,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  encrypt(data, customSecretKey) {
    try {
      this.EncryptKEY = customSecretKey ? customSecretKey : this.EncryptKEY;
      return CryptoJS.AES.encrypt(data, this.EncryptKEY).toString();
      // return CryptoJS.AES.encrypt(JSON.stringify(data), this.EncryptKEY).toString();
    } catch (e) {
      console.log(e);
      return data;
    }
  }

  decrypt(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.EncryptKEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
      return data;
    }
  }


  base64Decryption(value: string){
    value = value.replace(environment.base64EncryptionKey, '');
    if (value) {
      try {
        value = window.atob(value);
        let stringifiedValue = value ? JSON.stringify(value) : null;
        if (stringifiedValue.includes('schedule_id')) {
          let decryptedValue =  value ? JSON.parse(value) : null;
          return decryptedValue;
        }
        return null;
      } catch(e) {
        return null;
      }
    }
    return null;
  }
}

