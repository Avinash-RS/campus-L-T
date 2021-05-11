import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class JoiningFormComponent implements OnInit {

  activeStep: any = '0';
  valid = {
    personal: true,
    contact: false,
    dependent: false,
    education: false,
    upload: false,
    preview: false,
    submit: false
  }
  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) {
    const subWrapperMenus = null;
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }


  ngOnInit() {
  }

  validCheck() {
    // console.log(this.activeStep);
    
    // array.forEach(element => {
      
    // });
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
      
    // }
    for (const property in this.valid) {

      // console.log(`${property}: ${this.valid[property]}`);
    }
  }
}
