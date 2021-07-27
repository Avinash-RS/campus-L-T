import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-quality-area',
  templateUrl: './quality-area.component.html',
  styleUrls: ['./quality-area.component.scss']
})
export class QualityAreaComponent implements OnInit, OnChanges {
  @Input() getAllReportsData;
  getAreaofDevelopment: any;
  areatoimprove: any
  constructor() { }

  ngOnInit(): void {
    this.getStrengthAndWeakness();
  }

  ngOnChanges() {
    this.getStrengthAndWeakness();
  }

  getStrengthAndWeakness() {
    if (this.getAllReportsData && this.getAllReportsData.strength && this.getAllReportsData.strength.length > 0) {
      this.getAreaofDevelopment = this.getAllReportsData.strength;
    } else {
      this.getAreaofDevelopment = [];
    }

    if (this.getAllReportsData && this.getAllReportsData.areatoimprove && this.getAllReportsData.areatoimprove.length > 0) {
      this.areatoimprove = this.getAllReportsData.areatoimprove;
    } else {
      this.areatoimprove = [];
    }

  }

}
