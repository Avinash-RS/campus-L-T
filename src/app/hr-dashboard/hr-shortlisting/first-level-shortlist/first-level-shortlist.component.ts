import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-first-level-shortlist',
  templateUrl: './first-level-shortlist.component.html',
  styleUrls: ['./first-level-shortlist.component.scss']
})
export class FirstLevelShortlistComponent implements OnInit, AfterViewInit {

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
