import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-closed',
  templateUrl: './form-closed.component.html',
  styleUrls: ['./form-closed.component.scss']
})
export class FormClosedComponent implements OnInit {

  contentName = '';
  constructor(
    private ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getRouteHeading();
  }

  getRouteHeading() {
    this.ActivatedRoute.queryParamMap.subscribe((data: any) => {
      let params = data.params;
      this.contentName = params && params.name ? params.name : '';
    });
  }

}
