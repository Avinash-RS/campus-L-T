import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-schedule-video-assess',
  templateUrl: './schedule-video-assess.component.html',
  styleUrls: ['./schedule-video-assess.component.scss']
})
export class ScheduleVideoAssessComponent implements OnInit {
  color = '#BE2423';
  checked = false;
  disabled = false;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(templateRef) {
    this.dialog.open(templateRef, {
      panelClass: 'scheduleVideoPopup',
      width: "60%",
      height: "100%",
      closeOnNavigation: true,
      disableClose: true,
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

}
