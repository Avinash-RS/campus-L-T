import { Component, OnInit, Input, OnChanges } from '@angular/core';
import D3Funnel from 'd3-funnel';

@Component({
  selector: 'app-funnel-chart',
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.scss']
})
export class FunnelChartComponent implements OnInit, OnChanges {
  @Input() chartOptions: any;

  public funnel;

  chartjsChartOptions: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.drawFunnelChart();
  }

  drawFunnelChart(): void {
    console.log('this.chartOptions?.data', this.chartOptions?.data);
    if (this.chartOptions?.data) {
      let data = this.chartOptions?.data;
      let options = this.chartOptions?.options;
      this.funnel = new D3Funnel('#funnel');
      this.funnel.draw(data, options);
    }
  }

}
