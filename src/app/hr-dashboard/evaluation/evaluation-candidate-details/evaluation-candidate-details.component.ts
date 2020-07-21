import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface CandidateDetails {
  sno: number;
  assessmentName: string;
  groupName: string;
  shortlistName: string;
  shortlistedCandidates: string;
  date: string;
  time: string;
  status: string;
  shortlistby: string;
  viewdetails: boolean;
}
const ELEMENT_DATA: CandidateDetails[] = [
  {sno: 1, assessmentName: 'Hydrogen', groupName: '1.0079', shortlistName: 'H', shortlistedCandidates: 'sdaasd',
  date: '10-12-2020', time: '12:00', status: 'passed', shortlistby: 'adasd', viewdetails: true}

];
@Component({
  selector: 'app-evaluation-candidate-details',
  templateUrl: './evaluation-candidate-details.component.html',
  styleUrls: ['./evaluation-candidate-details.component.scss']
})
export class EvaluationCandidateDetailsComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'assessmentName', 'groupName', 'shortlistName',
  'shortlistedCandidates', 'date', 'time', 'status', 'shortlistby', 'viewdetails'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor() {

   }

  ngOnInit() {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
