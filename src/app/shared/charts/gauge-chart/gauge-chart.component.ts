import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit, OnChanges {

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
  tooltipDisabled: any;
  showText: any;
  min: any;
  max: any;
  showAxis: any;
  bigSegments: any;
  smallSegments: any;
  units: any;

  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.chartValueMapping();
  }

  chartValueMapping() {
    this.headingTitle = this.chartOptions?.headingTitle;
    this.chartData = this.chartOptions?.chartData;
    this.widthHeight = this.chartOptions?.widthHeight;
    this.colorScheme = this.chartOptions?.colorScheme;
    this.animations = this.chartOptions?.animations;
    this.legend = this.chartOptions?.legend;
    this.legendTitle = this.chartOptions?.legendTitle;
    this.legendPosition = this.chartOptions?.legendPosition;
    this.showText = this.chartOptions?.showText;
    this.min = this.chartOptions?.min;
    this.max = this.chartOptions?.max;
    this.units = this.chartOptions?.units;
    this.showAxis = this.chartOptions?.showAxis;
    this.bigSegments = this.chartOptions?.bigSegments;
    this.smallSegments = this.chartOptions?.smallSegments;
    this.tooltipDisabled = this.chartOptions?.tooltipDisabled;
  }

  onSelect(event) {
    console.log(event);
  }

}
