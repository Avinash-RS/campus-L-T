import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-candidate-bulk-upload',
  templateUrl: './candidate-bulk-upload.component.html',
  styleUrls: ['./candidate-bulk-upload.component.scss']
})
export class CandidateBulkUploadComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor() { }

  ngOnInit() {
  }

}