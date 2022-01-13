import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';

@Component({
  selector: 'app-adani-candidate-faq',
  templateUrl: './candidate-faq.component.html',
  styleUrls: ['./candidate-faq.component.scss']
})
export class AdaniCandidateFaqComponent implements OnInit {
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;

  constructor() { }

  ngOnInit() {
  }

}
