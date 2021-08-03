import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as moment from 'moment'; //in your component

@Component({
  selector: 'app-assessment-info',
  templateUrl: './assessment-info.component.html',
  styleUrls: ['./assessment-info.component.scss']
})
export class AssessmentInfoComponent implements OnInit, OnChanges {
  @Input() getAllReportsData;
  @Input() driveName;
  assessmentsList: any;
  colorCode = 'Good';
  iconBase = 'like';
  timeTaker: number;
  TimeTakerMins: number;
  timeTakerSec: any;
  TimeTakenMins: number;
  timeTakenSec: any;
  constructor() { }

  ngOnInit(): void {
    this.getAssessmentInfo();
  }

  ngOnChanges() {
    this.getAssessmentInfo();
  }

  getAssessmentInfo() {
    if (this.getAllReportsData && this.getAllReportsData.driveDetails && this.getAllReportsData.driveDetails.length > 0 && this.getAllReportsData.selectedDriveName) {
      const assessmentDrive = this.getAllReportsData.driveDetails.find((x => x.drivename == this.getAllReportsData.selectedDriveName))
      this.assessmentsList = assessmentDrive.assessments;
      this.assessmentsList && this.assessmentsList.length > 0 ? this.covertToPercentage() : '';
    }
  }

  covertToPercentage() {
    this.assessmentsList.forEach(element => {
      if (element.score && element.maxscore) {
        let score = Number(element.score) / Number(element.maxscore) * 100;
        let percentage = Number.isInteger(score) ? score : score.toFixed(2);
        element.percentageScore = percentage;
      }
    });
  }

  getCredibility(score) {
    if (score < 40) {
      return 'Weak';
    }
    if (score >=40 && score < 80) {
      return 'Average';
    }
    if (score >=80 && score < 90) {
      return 'Good';
    }
    if (score >=90) {
      return 'Excellent';
    }
    return null;
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }

  getTimetaker(time){
    if(time){
      // debugger
      let convertTime = time.toString();
      let SplitTime = convertTime.split(/([.])/);
      this.TimeTakerMins = parseInt(SplitTime[0]);
      let sec = '0.' + SplitTime[2];
      let conIntoSec = parseFloat(sec) * 60;
      this.timeTakerSec = conIntoSec.toFixed(0);
      // console.log( this.timeTakerSec,' this.timeTakerSec')
    }
  }

  getTimetaken(takenTime){
    if(takenTime){
      let convertTime1 = takenTime.toString();
      let SplitTime1 = convertTime1.split(/([.])/);
      this.TimeTakenMins = parseInt(SplitTime1[0]);
      let sec = '0.' + SplitTime1[2];
      let conIntoSec1 = parseFloat(sec) * 60;
      this.timeTakenSec = conIntoSec1.toFixed(0);
    }
  }

}
