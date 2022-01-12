import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-larsen-master',
  templateUrl: './larsen-master.component.html',
  styleUrls: ['./larsen-master.component.scss']
})
export class LarsenMasterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    console.log('in larsen');
  }

}
