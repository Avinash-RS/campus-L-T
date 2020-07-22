import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
export interface CandidateDetails {
  sno: number;
  assessmentName: string;
  groupName: string;
  shortlistName: string;
  viewdetails: boolean;
}

const ELEMENT_DATA: CandidateDetails[] = [
  {sno: 1, assessmentName: 'Hydrogen', groupName: '1.0079', shortlistName: 'H', viewdetails: true}

];
@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit {
  appConstant = CONSTANT.ENDPOINTS;
  displayedColumns: string[] = ['sno', 'assessmentName', 'groupName', 'shortlistName', 'viewdetails'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor() { }

  ngOnInit() {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
