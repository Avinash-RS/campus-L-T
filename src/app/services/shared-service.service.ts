import { Injectable } from '@angular/core';
import { from, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  constructor() { }

  // To update sub-menus when main navigation changes.
  subMenuSubject = new Subject();
  // To send message to Admin userlist page to hide user list component. (When edit page route happens)
  hideUserListComp = new Subject();
}
