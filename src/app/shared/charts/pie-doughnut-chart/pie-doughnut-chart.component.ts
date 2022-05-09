import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pie-doughnut-chart',
  templateUrl: './pie-doughnut-chart.component.html',
  styleUrls: ['./pie-doughnut-chart.component.scss']
})
export class PieDoughnutChartComponent implements OnInit {

  @Input() chartOptions: any;
  // options
  headingTitle: any;
  chartData: any;
  widthHeight: any;
  colorScheme: any;
  animations: any;
  labels: any;
  trimLabels: any;
  maxLabelLength: any = 30;
  legend: any;
  legendTitle: any;
  legendPosition: any;
  explodeSlices: any = false;
  doughnut: any = false;
  arcWidth: any = 0.25;
  gradient: any = false;
  tooltipDisabled: any;

  constructor() { }

  ngOnInit() {
    this.chartValueMapping();
  }

  chartValueMapping() {
    this.headingTitle = this.chartOptions.headingTitle;
    this.chartData = this.chartOptions.chartData;
    this.widthHeight = this.chartOptions.widthHeight;
    this.colorScheme = this.chartOptions.colorScheme;
    this.animations = this.chartOptions.animations;
    this.labels = this.chartOptions.labels;
    this.trimLabels = this.chartOptions.trimLabels;
    this.maxLabelLength = this.chartOptions.maxLabelLength;
    this.legend = this.chartOptions.legend;
    this.legendTitle = this.chartOptions.legendTitle;
    this.legendPosition = this.chartOptions.legendPosition;
    this.explodeSlices = this.chartOptions.explodeSlices;
    this.doughnut = this.chartOptions.doughnut;
    this.arcWidth = this.chartOptions.arcWidth;
    this.gradient = this.chartOptions.gradient;
    this.tooltipDisabled = this.chartOptions.tooltipDisabled;
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
