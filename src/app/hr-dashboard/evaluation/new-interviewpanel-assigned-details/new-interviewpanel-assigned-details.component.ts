import { Component, OnInit } from '@angular/core';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-interviewpanel-assigned-details',
  templateUrl: './new-interviewpanel-assigned-details.component.html',
  styleUrls: ['./new-interviewpanel-assigned-details.component.scss']
})
export class NewInterviewpanelAssignedDetailsComponent implements OnInit {

  selectedInstitute: any;
  selectedDiscipline: any;
  selectedEdu: any;
  selectedAssessment: any;
  selectedStatus: any = '1';
  allInstitutes: any;
  allDisciplines: any;
  EduLevel = DropdownListForKYC['level'];
  allEducations: any;
  allAssessments: any;
  routedData: any;
  statusList = [
    {
      name: 'Unassigned',
      value: '0'
    },
    {
      name: 'Assigned',
      value: '1'
    }
  ];

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
   }

  ngOnInit() {
    this.getInstitute();
    this.getEducation();
  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['data']) {
        this.routedData = JSON.parse(params['data']);
        this.selectedInstitute = this.routedData.college_name;
        this.getParticularAssessmentAndDiscipline(this.selectedInstitute);
        this.selectedDiscipline = this.routedData.discipline;
        this.selectedEdu = this.routedData.education_level;
        this.selectedAssessment = this.routedData.assement_name;
        this.selectedStatus = '1';
        this.go();
      } else {
        console.log('null');        
      }
      // this.assessmentDetails(params['data']);
      // this.getUsersList(params['data']);
    });
  }

  getParticularAssessmentAndDiscipline(data) {
    const apiData = {
      institute: data ? data : ''
    }
    this.adminService.getParticularInstituteDiscipline(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allAssessments = data && data['assement_name'] ? data['assement_name'] : [];
      this.allDisciplines = data && data['discipline_array'] ? data['discipline_array'] : [];
    }, (err) => {
    });
  }

  instituteChangeForDiscipline(data) {
    this.getParticularAssessmentAndDiscipline(data);
  }

  getEducation() {
    let Temp = this.EduLevel ? this.EduLevel : [];
    const final = [];
    Temp.forEach(element => {
      if (element && element['name'] == 'UG') {
        final.push(element);
      }
      if (element && element['name'] == 'PG') {
        final.push(element);
      }
    });
    this.allEducations = final ? final : [];
  }

  getInstitute() {
    this.adminService.getInterviewpanelInstitutes().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  go() {
    const apiData = {
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      discipline: this.selectedDiscipline ? this.selectedDiscipline : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      assement_name: this.selectedAssessment ? this.selectedAssessment : '',
      status: this.selectedStatus ? this.selectedStatus : ''
    }
    console.log('apiData', apiData);
    
    // this.adminService.getAlreadyAssigned(apiData).subscribe((data: any) => {
    //   this.appConfig.hideLoader();      
    //   console.log('data', data);
      
      // const datas = data ? data : [];
      // this.showDefault = false;
      // this.getUsersList(datas);
    // }, (err) => {
    // });
  }

}
