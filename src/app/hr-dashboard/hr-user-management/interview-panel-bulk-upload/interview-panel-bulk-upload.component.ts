import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-interview-panel-bulk-upload',
  templateUrl: './interview-panel-bulk-upload.component.html',
  styleUrls: ['./interview-panel-bulk-upload.component.scss']
})
export class InterviewPanelBulkUploadComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

}
