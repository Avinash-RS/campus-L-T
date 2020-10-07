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
  printSubject = new Subject();
  maintenanceSubject = new Subject();
}
