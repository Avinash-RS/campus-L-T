import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit {

  // @Input() chartOptions: any;
  // options
  headingTitle: any;
  chartData: any;
  widthHeight: any;
  colorScheme: any;
  animations: any;
  legend: any;
  legendTitle: any;
  legendPosition: any;
  tooltipDisabled: any;
  showText: any;
  min: any;
  max: any;
  showAxis: any;
  bigSegments: any;
  smallSegments: any;

  chartOptions = {
    headingTitle: 'Selected Candidates Summary',
    chartData: [
      {
        "name": "Mailed (100)",
        "value": 100
      },
      {
        "name": "JF Submitted (95)",
        "value": 95
      },
      {
        "name": "Verified (79)",
        "value": 79
      },
      {
        "name": "Business Unit Assigned (8)",
        "value": 8
      },
      {
        "name": "Pre Employment Medical Checkup (62)",
        "value": 62
      }],
    widthHeight: undefined,//[490, 400],
    colorScheme: {domain: ['#1F78B4', '#5FCEFF', '#2A94C3', '#E6D263', '#49AE31'] },
    animations: true,
    legend: true,
    legendTitle: '',
    legendPosition: 'below',
    showText: true,
    min: 0,
    max: 100,
    bigSegments: 10,
    smallSegments: 0,
    showAxis: true,
    tooltipDisabled: false
  }

  constructor() {

  }

  ngOnInit() {
    this.chartValueMapping();
  }

  chartValueMapping() {
    this.headingTitle = this.chartOptions.headingTitle;
    this.chartData = this.chartOptions.chartData;
    this.widthHeight = this.chartOptions.widthHeight;
    this.colorScheme = this.chartOptions.colorScheme;
    this.animations = this.chartOptions.animations;
    this.legend = this.chartOptions.legend;
    this.legendTitle = this.chartOptions.legendTitle;
    this.legendPosition = this.chartOptions.legendPosition;
    this.showText = this.chartOptions.showText;
    this.min = this.chartOptions.min;
    this.max = this.chartOptions.max;
    this.showAxis = this.chartOptions.showAxis;
    this.bigSegments = this.chartOptions.bigSegments;
    this.smallSegments = this.chartOptions.smallSegments;
    this.tooltipDisabled = this.chartOptions.tooltipDisabled;
  }

  onSelect(event) {
    console.log(event);
  }

}
