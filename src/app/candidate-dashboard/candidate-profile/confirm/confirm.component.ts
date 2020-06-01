import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.appConfig.nzNotification('success', 'Submitted', 'Your Declaration has been submitted');
    console.log('submitted');

  }
}
