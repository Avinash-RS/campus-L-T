import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
export interface CandidateDetails {
  sno: string;
  assessmentName: string;
  groupName: string;
  action: boolean;
}
const ELEMENT_DATA: CandidateDetails[] = [
  {sno: 'Section 1', assessmentName: '65.00', groupName: 'Question ', action: true}

];
@Component({
  selector: 'app-assessment-candidate-details',
  templateUrl: './assessment-candidate-details.component.html',
  styleUrls: ['./assessment-candidate-details.component.scss']
})
export class AssessmentCandidateDetailsComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'assessmentName', 'groupName', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  viewQus(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '80%',
      height: '70%',
      closeOnNavigation: true,
      disableClose: true,
    });
  }
}
