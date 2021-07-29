import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  public isLoadingSub = new BehaviorSubject<boolean>(false);
  // isLoading$ = this.isLoading$$.asObservable();

  setLoading(isLoading: boolean): void {
    this.isLoadingSub.next(isLoading);
  }
}
