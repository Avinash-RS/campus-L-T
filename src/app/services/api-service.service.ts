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


  registration() {
    const datas = {
      "name": [{ "value": "avi" }],
      "mail": [{ "value": "avis@gmail.com" }],
      "roles": [{ "target_id": "institute" }],
      "field_first_name": [{ "value": "madhu" }],
      "field_lname": [{ "value": "das" }],
      "field_job_title": [{ "value": "developer" }],
      "field_mobile_number": [{ "value": "8287495308" }],
      "field_institute_name": [{ "value": "madhu" }],
      "field_institute_email": [{ "value": "madhu.kumari@cintanatech.com" }],
      "field_state": [{ "value": "tamilnadu" }],
      "field_city": [{ "value": "chennai" }],
      "field_comments": [{ "value": "Hi this is for testing purpose" }]
    };

    this.httpOptions = {
      headers: new HttpHeaders({ 'X-CSRFToken': 'z6VsT71BaLeBY2hZUkwIsMRDXyQYJnSrygji1XvqdjA' }),
    };
    console.log(datas);

    fetch('http://104.211.226.77/d8cintana/user/register?_format=hal_json', { method: 'POST', body: JSON.stringify(datas), mode: 'no-cors', headers: { 'X-CSRFToken': 'z6VsT71BaLeBY2hZUkwIsMRDXyQYJnSrygji1XvqdjA', 'Content-Type': 'application/json' }}).then((data) => {
      console.log(data);
    })
      .catch((err) => {
        console.log(err);
      });


    return this.http.post('http://104.211.226.77/d8cintana/user/register?_format=hal_json', datas);
    // return this.http.post(`https://jsonplaceholder.typicode.com/`, datas, this.httpOptions);
  }
}
