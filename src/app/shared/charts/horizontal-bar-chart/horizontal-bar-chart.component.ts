import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit {

  @Input() chartOptions: any;
  // options
  headingTitle: any;
  chartData: any;
  widthHeight: any;
  colorScheme: any;
  animations: any;
  legend: any;
  legendTitle: any;
  legendPosition: any;
  xAxis: any;
  yAxis: any;
  showGridLines: any;
  roundDomains: any;
  showXAxisLabel: any;
  showYAxisLabel: any;
  xAxisLabel: any;
  yAxisLabel: any;
  trimXAxisTicks: any;
  trimYAxisTicks: any;
  rotateXAxisTicks: any;
  maxXAxisTickLength: any;
  maxYAxisTickLength: any;
  showDataLabel: any;
  noBarWhenZero: any;
  gradient: any;
  barPadding: any;
  tooltipDisabled: any;
  roundEdges: any;
  yScale: any;

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
    this.xAxis = this.chartOptions.xAxis;
    this.yAxis = this.chartOptions.yAxis;
    this.showGridLines = this.chartOptions.showGridLines;
    this.roundDomains = this.chartOptions.roundDomains;
    this.showXAxisLabel = this.chartOptions.showXAxisLabel;
    this.showYAxisLabel = this.chartOptions.showYAxisLabel;
    this.xAxisLabel = this.chartOptions.xAxisLabel;
    this.yAxisLabel = this.chartOptions.yAxisLabel;
    this.trimXAxisTicks = this.chartOptions.trimXAxisTicks;
    this.trimYAxisTicks = this.chartOptions.trimYAxisTicks;
    this.rotateXAxisTicks = this.chartOptions.rotateXAxisTicks;
    this.maxXAxisTickLength = this.chartOptions.maxXAxisTickLength;
    this.maxYAxisTickLength = this.chartOptions.maxYAxisTickLength;
    this.showDataLabel = this.chartOptions.showDataLabel;
    this.noBarWhenZero = this.chartOptions.noBarWhenZero;
    this.gradient = this.chartOptions.gradient;
    this.barPadding = this.chartOptions.barPadding;
    this.tooltipDisabled = this.chartOptions.tooltipDisabled;
    this.roundEdges = this.chartOptions.roundEdges;
    this.yScale = this.chartOptions.yScaleTickValue;
  }

  onSelect(event) {
    console.log(event);
  }

}
