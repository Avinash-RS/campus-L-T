import { Component, OnInit } from "@angular/core";
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: "app-join-interview",
  templateUrl: "./join-interview.component.html",
  styleUrls: ["./join-interview.component.scss"]
})

export class JoinInterviewComponent implements OnInit {
  interview;
  userEmail;
  showInterview;
  role;
  roleType;
  userId;
  findIndex
  constructor(private adminService: AdminServiceService,private appConfig: AppConfigService,private activatedRoute: ActivatedRoute
    ) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.userId= params.email;
    });
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
      'email': this.userEmail
    }
    this.adminService.getScheduledList(obj).subscribe((result:any)=>{
      this.appConfig.hideLoader();
      if(result.success && result?.data?.length > 0){
        this.interview = result.data;
        if(this.roleType == 'interviewer'){        
        this.interview.forEach((value,index)=>{
          value.userDtl.forEach(element => {
              if(element.emailId == this.userId) {
                this.findIndex = index
              } 
          });
        })
        this.interview = this.interview.filter((_, index) => index == this.findIndex);
        if(this.interview?.userDtl){
          this.interview.userDtl.forEach((element,index) => {
            if(element.type != this.roleType && this.userEmail != element.emailId){
              this.interview.userDtl.splice(index,1);
            }
          });
        }
      }
          this.interview = this.interview[0]
          if(this.interview?.userDtl?.length > 0){
            this.showInterview = true;
            //this.isTimeExpired(this.interview.startTime, this.interview.endTime)
          } else {
            this.showInterview = false;
          }
        
      }
    })
  }
  openRTC(view){
    window.open(view.userDtl[0].link, 'Interview').focus();
  }
}
