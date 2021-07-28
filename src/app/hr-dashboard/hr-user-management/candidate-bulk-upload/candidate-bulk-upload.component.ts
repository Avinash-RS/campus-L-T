import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-candidate-bulk-upload',
  templateUrl: './candidate-bulk-upload.component.html',
  styleUrls: ['./candidate-bulk-upload.component.scss']
})
export class CandidateBulkUploadComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
        // // Hack: Scrolls to top of Page after page view initialized
        // let top = document.getElementById('top');
        // if (top !== null) {
        //   top.scrollIntoView();
        //   top = null;
        // }
  }
}
