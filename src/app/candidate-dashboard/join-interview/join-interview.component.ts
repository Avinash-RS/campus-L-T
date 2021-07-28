import { Component, OnInit } from "@angular/core";
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import moment from 'moment';

@Component({
  selector: "app-join-interview",
  templateUrl: "./join-interview.component.html",
  styleUrls: ["./join-interview.component.scss"]
})

export class JoinInterviewComponent implements OnInit {
  interview;
  userEmail;
  showInterview = false;
  role;
  roleType;
  constructor(private adminService: AdminServiceService,private appConfig: AppConfigService,
    ) {
  this.userEmail = this.appConfig.getLocalData('userEmail')
  this.role = this.appConfig.getLocalData('roles');
  if(this.role == 'interview_panel'){
    this.roleType = 'interviewer';
  } else if(this.role == 'candidate') {
    this.roleType = 'candidate';
  }

  this.getInterview();
  }

  ngOnInit() {

  }

  isTimeExpired(startTime, endTime) {
    if (startTime && endTime) {
      let custom = moment(endTime).diff(moment.now(), 'minutes');
      if (custom > 0) {
        return 'yes'; // Not expired
      }
      return 'no'; // Expired
    }
}
  getInterview(){
    var obj = {
      'userDtl.emailId': this.userEmail
    }
    this.adminService.getScheduledList(obj).subscribe((result:any)=>{
      if(result.success && result?.data?.length > 0){
        this.interview = result.data[0];
        if(this.interview?.userDtl){
          this.interview.userDtl.forEach((element,index) => {
            if(element.type != this.roleType && this.userEmail == element.emailId){
              this.interview.userDtl.splice(index,1);
            }
          });
          if(this.interview?.userDtl?.length > 0){
            this.showInterview = true;
            //this.isTimeExpired(this.interview.startTime, this.interview.endTime)
          } else {
            this.showInterview = false;
          }
        }
        console.log(this.interview)
      }
    })
  }
  openRTC(view){
    window.open(view.userDtl[0].link, 'Interview').focus();
  }
}
