import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';

@Component({
  selector: 'app-general-candidate-faq',
  templateUrl: './candidate-faq.component.html',
  styleUrls: ['./candidate-faq.component.scss']
})
export class GeneralCandidateFaqComponent implements OnInit {
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;

  constructor() { }

  ngOnInit() {
  }

}
