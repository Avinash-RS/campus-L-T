import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  httpOptions: { headers: HttpHeaders; };

  datas = {
    "name": [{ "value": "bvizzzzwadad" }],
    "mail": [{ "value": "bviaadszz12z@gmail.com" }],
    "roles": [{ "target_id": "institute" }],
    "field_first_name": [{ "value": "madhu" }],
    "field_lname": [{ "value": "das" }],
    "field_job_title": [{ "value": "developer" }],
    "field_mobile_number": [{ "value": "8287495308" }],
    "field_institute_name": [{ "value": "vdhu" }],
    "field_institute_email": [{ "value": "bdhu.kumari@cintanatech.com" }],
    "field_state": [{ "value": "tamilnadu" }],
    "field_city": [{ "value": "chennai" }],
    "field_comments": [{ "value": "Hi this is for testing purpose" }]
  };

  constructor(
    private http: HttpClient
  ) { }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', 'hzsffAfKXnBcubBAOeGFvbQJSk5cDa5mnX-NE-T0O1M');
    return headers;
  }

  // Registration
  RegistrationForm(formdata) {
    // this.datas is api body data
    return this.http.post('http://104.211.226.77/d8cintana/user/register?_format=hal_json', formdata,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  // To get all cities
  getAllCity() {
    return this.http.get('http://104.211.226.77/d8cintana/cities.php');
  }

  // To get all cities
  getAllState() {
    return this.http.get('http://104.211.226.77/d8cintana/states.php');
  }

}

