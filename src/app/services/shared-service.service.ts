import { Injectable } from '@angular/core';
import { from, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  constructor() { }

  // To update sub-menus when main navigation changes.
  subMenuSubject = new Subject();
  // To update Admin userlist page
  updateUserlist = new Subject();
  commonUserListRefresh = new Subject();

  openJoiningRoutePopUp = new Subject();
  sendPopupResult = new Subject();
  joiningFormActiveSelector = new Subject();
  joiningFormStepperStatus = new Subject();
  StepperNavigationCheck = new Subject();
  joiningFormDataPassing = new Subject();

  screenRefreshOnDriveChange = new Subject();
  sessionTimeStartSubject = new Subject();
}
