import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent implements OnInit {

  level = [
    {
      name: 'SSLC',
      value: 'sslc'
    },
    {
      name: 'HSC',
      value: 'hsc'
    },
    {
      name: 'Diplamo',
      value: 'diplamo'
    },
    {
      name: 'Under Graduation',
      value: 'ug'
    },
    {
      name: 'Post Graduation',
      value: 'pg'
    },
    {
      name: 'Other',
      value: 'other'
    }
  ];

  selecetedLevel: any;
  educationForm: FormGroup;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.FormInitialization();
  }

  selectedLevelMethod(level) {
    this.selecetedLevel = level;
    this.educationForm.get('leveling').setValue(level.name);
  }

  FormInitialization() {
    this.educationForm = this.fb.group({
      leveling: ['', [Validators.required]]
    });
  }
}
