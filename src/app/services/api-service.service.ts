import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  httpOptions: { headers: HttpHeaders; };

  constructor(
    private http: HttpClient
  ) { }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', 'yqCx7dsGSWyYMPH_k5-LNeJjiekM_pMgANGKi7tE-Z4')
      .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  // Registration
  RegistrationForm(formdata) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana/entity/user?_format=hal_json`, formdata,
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
    return this.http.post(`http://104.211.226.77/d8cintana/user/lost-password?_format=json`, email,
      { withCredentials: true });
  }

  // Forgot Password
  passwordReset(data) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana/user/lost-password-reset?_format=json`, data,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Login
  login(loginData) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana/user/login?_format=json`, loginData,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`http://104.211.226.77/d8cintana/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

}

