import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vertical-chart',
  templateUrl: './vertical-chart.component.html',
  styleUrls: ['./vertical-chart.component.scss']
})
export class VerticalChartComponent implements OnInit {

  @Input() chartOption: any;
  chartOptions = {
    headingTitle: 'Application Details',
    widthHeight: [485, 400],
    chartData: [
      {
        "name": "",
        "value": 0
      },
      {
        "name": "Total Application",
        "value": 450
      },
      {
        "name": "Profile Submitted",
        "value": 200
      },
      {
        "name": "Profile Shortlisted",
        "value": 150
      }
    ],
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    },
    animations: true,
    legend: false, // Show legend or not
    legendTitle: 'Legend',
    legendPosition: 'right', // ['right', 'below'],
    xAxis: true, // Show x axis or not
    yAxis: true, // Show y axis or not
    showGridLines: true,
    roundDomains: false,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: '',
    yAxisLabel: '',
    trimXAxisTicks: true,
    trimYAxisTicks: true,
    rotateXAxisTicks: true,
    maxXAxisTickLength: 16,
    maxYAxisTickLength: 16,
    showDataLabel: true,
    noBarWhenZero: true,
    gradient: false,
    barPadding: 60,
    tooltipDisabled: false,
    roundEdges: false,
    yScaleTickValue: 100
  };
  // options
  headingTitle = this.chartOptions.headingTitle;
  chartData = this.chartOptions.chartData;
  widthHeight = this.chartOptions.widthHeight;
  colorScheme = this.chartOptions.colorScheme;
  animations = this.chartOptions.animations;
  legend = this.chartOptions.legend;
  legendTitle = this.chartOptions.legendTitle;
  legendPosition = this.chartOptions.legendPosition;
  xAxis = this.chartOptions.xAxis;
  yAxis = this.chartOptions.yAxis;
  showGridLines = this.chartOptions.showGridLines;
  roundDomains = this.chartOptions.roundDomains;
  showXAxisLabel = this.chartOptions.showXAxisLabel;
  showYAxisLabel = this.chartOptions.showYAxisLabel;
  xAxisLabel = this.chartOptions.xAxisLabel;
  yAxisLabel = this.chartOptions.yAxisLabel;
  trimXAxisTicks = this.chartOptions.trimXAxisTicks;
  trimYAxisTicks = this.chartOptions.trimYAxisTicks;
  rotateXAxisTicks = this.chartOptions.rotateXAxisTicks;
  maxXAxisTickLength = this.chartOptions.maxXAxisTickLength;
  maxYAxisTickLength = this.chartOptions.maxYAxisTickLength;
  showDataLabel = this.chartOptions.showDataLabel;
  noBarWhenZero = this.chartOptions.noBarWhenZero;
  gradient = this.chartOptions.gradient;
  barPadding = this.chartOptions.barPadding;
  tooltipDisabled = this.chartOptions.tooltipDisabled;
  roundEdges = this.chartOptions.roundEdges;
  yScale = this.chartOptions.yScaleTickValue;

  constructor() {

  }

  ngOnInit() {
    console.log('chart option', this.chartOption);
    console.log('chart options', this.chartOptions);
  }

  onSelect(event) {
    console.log(event);
  }

}
