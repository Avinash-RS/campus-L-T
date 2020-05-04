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

  // datas = {
  //   name: 'avi',
  //   age: 'hi'
  // };

  constructor(
    private http: HttpClient
  ) { }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', 'z6VsT71BaLeBY2hZUkwIsMRDXyQYJnSrygji1XvqdjA');
    return headers;
  }

  httpAPI(formdata) {
    // this.datas is api body data
    return this.http.post('http://104.211.226.77/d8cintana/user/register?_format=hal_json', formdata,
      { headers: this.getCustomHeaders(), withCredentials: true });
  }

  fetchAPI() {
    // this.datas is api body data
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-CSRFToken': 'z6VsT71BaLeBY2hZUkwIsMRDXyQYJnSrygji1XvqdjA' }),
    };
    fetch('http://104.211.226.77/d8cintana/user/register?_format=hal_json', { method: 'POST', body: JSON.stringify(this.datas), mode: 'no-cors', headers: { 'X-CSRFToken': 'z6VsT71BaLeBY2hZUkwIsMRDXyQYJnSrygji1XvqdjA', 'Content-Type': 'application/json' } }).then((data) => {
      console.log(data);
    })
      .catch((err) => {
        console.log(err);
      });
  }

}

