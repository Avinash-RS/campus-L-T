import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
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
      .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
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
    return this.http.get('http://104.211.226.77/d8cintana2/rest/session/token', { headers: this.withoutTokens() });
  }
  getToken() {
    this.csrfToken().subscribe((data: any) => {
      // localStorage.setItem('csrf', data);
    }, (err) => {
      if (err.status === 200) {
        this.appConfig.setSessionData('csrf', err.error.text);
      }
    });
  }
  // Registration
  RegistrationForm(formdata) {
    this.getToken();
    return this.http.post(`http://104.211.226.77/d8cintana/entity/user?_format=hal_json`, formdata,
      { headers: this.getCustomHeaders(), withCredentials: true });
    // return this.http.post(`http://104.211.226.77/d8cintana/user/register?_format=hal_json`, formdata,
    //   { headers: this.getCustomHeaders(), withCredentials: true });
  }

  CandidateRegistrationForm(formdata) {
    this.getToken();
    return this.http.post(`http://104.211.226.77/d8cintana2/rest/create-account?_format=json`, formdata,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  emailVerification(data) {
    this.getToken();
    return this.http.post(`http://104.211.226.77/d8cintana2/rest/verify-account?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // To get all cities
  getAllCity() {
    return this.http.get(`http://104.211.226.77/d8cintana/cities.php`);
  }

  // To get all cities
  getAllState() {
    return this.http.get(`http://104.211.226.77/d8cintana/states.php`);
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/lost-password?_format=json`, email,
      { withCredentials: true });
  }

  passwordTokenVerification(data) {
    this.getToken();
    return this.http.post(`http://104.211.226.77/d8cintana2/rest/verify-password?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Reset Password
  passwordReset(data) {
    this.getToken();
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/lost-password-reset?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Login
  login(loginData) {
    // this.getToken();
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/login?_format=json`, loginData,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

}

