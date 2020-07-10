import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  BASE_URL = environment.API_BASE_URL;
  BASE_URL_CITY = environment.API_BASE_URL_city;
  httpOptions: { headers: HttpHeaders; };


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
      // .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }
  getAfterCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*');
    return headers;
  }
  withoutTokens(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
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

    //   this.appConfig.hideLoader();
    //   // localStorage.setItem('csrf', data);
    // }, (err) => {
    //   if (err.status === 200) {
    //     this.appConfig.setSessionData('csrf', err.error.text);
    //   }
    // });
  }
  // Registration
  RegistrationForm(formdata) {
    return this.http.post(`${this.BASE_URL}/rest/create-account?_format=json`, formdata,
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
    return this.http.get(`${this.BASE_URL_CITY}/cities.php`);
  }

  // To get all cities
  getAllState() {
    return this.http.get(`${this.BASE_URL_CITY}/states.php`);
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/lost-password?_format=json`, email,
      { withCredentials: true });
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

}

