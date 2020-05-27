import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {

  home;
  constructor() { }

  ngOnInit() {
   this.home = CONSTANT.ENDPOINTS.LOGIN;
  }

}
