import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-candidate-uploads',
  templateUrl: './candidate-uploads.component.html',
  styleUrls: ['./candidate-uploads.component.scss']
})
export class CandidateUploadsComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor() { }

  ngOnInit() {
  }

}
