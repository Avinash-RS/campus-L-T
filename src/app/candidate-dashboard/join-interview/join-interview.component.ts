import { Component, OnInit } from "@angular/core";
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: "app-join-interview",
  templateUrl: "./join-interview.component.html",
  styleUrls: ["./join-interview.component.scss"]
})

export class JoinInterviewComponent implements OnInit {
  interview;
  userEmail;
  constructor(private adminService: AdminServiceService,private appConfig: AppConfigService,
    ) {
  this.userEmail = this.appConfig.getLocalData('userEmail')
  this.getInterview()
  }

  ngOnInit() {

  }
  getInterview(){
    var obj = {
      'userDtl.emailId': this.userEmail
    }
    this.adminService.getScheduledList(obj).subscribe((result:any)=>{
      if(result.success){
        this.interview = result.data[0];
        if(this.interview?.userDtl){
          this.interview.userDtl.forEach((element,index) => {
            if(element.type != 'candidate' && element.emailId == this.userEmail){
              this.interview.userDtl.splice(index,1)
            }
          });
        }
        console.log(this.interview)
      }
    })
  }
  openRTC(view){
    window.open(view.userDtl[0].link, '_blank').focus();
  }
}
