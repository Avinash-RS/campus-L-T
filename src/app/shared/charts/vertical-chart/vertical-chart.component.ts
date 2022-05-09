import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-vertical-chart',
  templateUrl: './vertical-chart.component.html',
  styleUrls: ['./vertical-chart.component.scss']
})
export class VerticalChartComponent implements OnInit, OnChanges {

  @Input() chartOptions: any;

  public chartPlugins = [pluginDataLabels];
  public chartjsChartOptionsObj: any;
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[];

  chartjsChartOptions: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.chartJSValueMapping();
  }

  chartJSValueMapping() {
    let delayed;
    this.chartjsChartOptionsObj = {
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        animationDuration: 500
      },
      animation: {
        duration: 1000,
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      tooltips:{
        enabled : true,
        // displayColors: false,
        // backgroundColor: 'white',
        // mode: 'label',
        // titleFontColor: '#c02222',
        // bodyFontColor: '#49ae31',
        // borderColor: '#999',
        // borderWidth: 1,
        // footerFontColor:'#eee',
        // footerMarginTop:8,
        // footerSpacing:8,
        // titleMarginBottom: 7,
        // bodySpacing: 7,
        // yAlign: 'center',
      },
      title: {
        text: this.chartOptions?.chartTitle,
        display: true,
        position: 'bottom',
        fontSize: 14,
        font: {
          weight: '500'
        },
        fontColor: '#333333'
      },
      legend: {
        display: this.chartOptions?.legend,
        position: 'bottom',
        title: {
          color: '#444444',
          font: {
            size: '12'
          }
        }
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          color: '#565656',
          display: function(context) {
            return context?.dataset?.type == 'bar' ? true : false;
          },
          font: {
            size: 16,
            weight: "bold"
          },
        //   formatter: (value, ctx) => {
        //     let percentage = value.y + "%";
        //     return percentage;
        // },
        }
      },
      layout:{
        padding: {
          left: 20,
          right: 50,
          top: 30,
          bottom: 0
      }
      },
      scales:{
        xAxes:[{
          grid: {
            drawTicks: true
          },
          offset: true,
          ticks: {
            padding: 0,
            beginAtZero: false,
            display: true,
        },
          gridLines:{
            offsetGridLines: false,
            display: false,
          },
        }],
        yAxes:[{
          scaleLabel: {
            display: true,
            labelString: 'Number of Candidates',
            fontColor: '#333333',
            fontStyle: 'medium',
            fontSize: '14'
          },
          grid: {
            drawTicks: false
          },
          offset: false,
          ticks: {
            padding: 0,
            beginAtZero: true,
            display: true,
            min: 0,
            stepSize:50,
          },
          gridLines:{
            offsetGridLines: false,
            display: true,
            color: "#b3b3b3"
          }
        }],
      }
    }

    this.barChartLabels = this.chartOptions?.labels;
    this.barChartData = this.chartOptions?.data?.dataSets;

    this.chartjsChartOptions  = {
      ChartLabels: this.barChartLabels,
      barChartType: this.barChartType,
      barChartLegend: this.barChartLegend,
      barChartPlugins: this.barChartPlugins,
      barChartData: this.barChartData,
      chartOptions: this.chartjsChartOptionsObj,
      headingTitle: this.chartOptions?.headingTitle,
      }

  }

}
