import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-second-level-shortlist',
  templateUrl: './second-level-shortlist.component.html',
  styleUrls: ['./second-level-shortlist.component.scss']
})
export class SecondLevelShortlistComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
}

}
