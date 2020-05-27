import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
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
      .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
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
      .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'admin'));
    return headers;
  }

  getCustomHeadersWithBasicAuthWithHalContentType(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/hal+json')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'admin'));
    return headers;
  }


  getCustomHeadersWithBasicAuth(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'admin'));
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

  // Users List
  userList() {
    return this.http.get(`http://104.211.226.77/d8cintana2/admin/user-list?_format=json`,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }

  // Add User
  addUser(formdata) {
    return this.http.post(`http://104.211.226.77/d8cintana2/entity/user?_format=hal_json`, formdata,
      { headers: this.getAfterCustomHeadersWithBasicAuth(), withCredentials: true });
  }

  // Edit User
  editUser(formdata, UserId) {
    return this.http.patch(`http://104.211.226.77/d8cintana2/user/${UserId}?_format=hal_json`, formdata,
      {
        headers: this.getCustomHeadersWithBasicAuthWithHalContentType(),
        withCredentials: true
      });
  }

  // Delete User
  deleteUser(UserId) {
    return this.http.delete(`http://104.211.226.77/d8cintana2/user/${UserId}?_format=hal_json`,
      {
        headers: this.getAfterCustomHeadersWithBasicAuth(),
        withCredentials: true
      });
  }

  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/lost-password?_format=json`, email,
      { withCredentials: true });
  }


  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana2/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.getAfterCustomHeaders(), withCredentials: true });
  }


}
