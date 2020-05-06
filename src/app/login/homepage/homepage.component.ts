import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  instituteRegister() {
    this.router.navigate(['/institute']);
  }

  corporateRegister() {
    this.router.navigate(['/corporate']);
  }

  candidateRegister() {
    this.router.navigate(['/candidate']);
  }


}
