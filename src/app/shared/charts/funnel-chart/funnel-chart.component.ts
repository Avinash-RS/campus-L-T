import { Component, OnInit, Input } from '@angular/core';
import D3Funnel from 'd3-funnel';

@Component({
  selector: 'app-funnel-chart',
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.scss']
})
export class FunnelChartComponent implements OnInit {
  @Input() chartOptions: any;

  public funnel;

  chartjsChartOptions: any;

  constructor() {
  }

  ngOnInit() {
    this.drawFunnelChart();
  }

  drawFunnelChart(): void {
    let data = this.chartOptions?.data;
    let options = this.chartOptions?.options;
    this.funnel = new D3Funnel('#funnel');
    this.funnel.draw(data, options);
  }

}
