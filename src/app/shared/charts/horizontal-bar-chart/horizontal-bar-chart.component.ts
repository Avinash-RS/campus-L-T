import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, OnChanges {

  @Input() chartOptions: any;
  @Input() chartLegendData: any;

  public chartPlugins = [pluginDataLabels];
  public chartjsChartOptionsObj: any;//ChartOptions;
  public barChartLabels: Label[];
  public barChartType: ChartType = 'horizontalBar';
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
        titleMarginBottom: 7,
        bodySpacing: 7,
        yAlign: 'center',
        callbacks: {
          title: function(tooltipItem, chart){
            return tooltipItem[0].label;
          },
          label:function(tooltipItem, data){
            if (tooltipItem.index == 0) {
              if (tooltipItem.datasetIndex == 0) {
                return 'Selected: ' + tooltipItem.value;
              } else {
                return 'Not Selected: ' + tooltipItem.value;
              }
            }
            if (tooltipItem.index == 1) {
              if (tooltipItem.datasetIndex == 0) {
                return 'Request for Reschedule: ' + tooltipItem.value;
              } else {
                return 'No Show: ' + tooltipItem.value;
              }
            }
            if (tooltipItem.index == 2) {
                return 'Inprogress: ' + tooltipItem.value;
            }
          }
        }
      },
      title: {
        text: this.chartOptions?.headingTitle,
        display: false,
        fontSize: 16,
        fontColor: '#565656'
      },
      legend: {
        display: this.chartOptions?.legend,
        labels: {
          fontColor: 'rgb(255, 99, 132)'
        }
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          color: '#565656',
          display: function(context) {
            if (context.dataIndex == 2) {
              return true;
            }
            if (context.datasetIndex == 0) {
              return false
            }
            return true;
          },
          formatter: function(value, context) {
            if (context.dataIndex == 2) {
              return value;
            } else {
              let sum = context?.chart?.config?.data?.datasets[context?.datasetIndex - 1].data[context?.dataIndex];
              return value + sum;
            }
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
          left: 0,
          right: 50,
          top: 20,
          bottom: 0
      }
      },
      scales:{
        xAxes:[{
          grid: {
            drawTicks: false
          },
          offset: false,
          stacked: true,
          ticks: {
            padding: 0,
            beginAtZero: false,
            display: true,
        },
          gridLines:{
            offsetGridLines: false,
            display:true,
            borderDash: [7, 3],
            color: "rgba(112, 112, 112, .4)",
          },
        }],
        yAxes:[{
          grid: {
            drawTicks: false
          },
          offset: true,
          stacked: true,
          ticks: {
            padding: 0,
            beginAtZero: true,
            display: true,
            // min: 0,
            // max: 500,
            // stepSize:100,
            callback: function(value) {
                if (value == 'Appeared for Interview') {
                  return ['Appeared for', 'Interview']
                }
                if (value == 'Not Appeared for Interview') {
                  return ['Not Appeared', 'for Interview']
                }
                if (value == 'Awaiting Feedback') {
                  return ['Awaiting', 'Feedback']
                }
                else{
                  return value;
                }
            }
          },
          gridLines:{
            offsetGridLines: false,
            display: false,
            borderDash: [1, 3],
            color: "#b3b3b3"
          }
        }],
      }
    }

    this.barChartLabels = this.chartOptions?.labels;
    this.barChartData = [
      {
        data: this.chartOptions?.multipleDataSet?.data1?.dataSets,
        barThickness: 30,
        backgroundColor: this.chartOptions?.multipleDataSet?.data1?.background,
        hoverBackgroundColor: this.chartOptions?.multipleDataSet?.data1?.hoverBackground
      },
      {
        data: this.chartOptions?.multipleDataSet?.data2?.dataSets,
        barThickness: 30,
        backgroundColor: this.chartOptions?.multipleDataSet?.data2?.background,
        hoverBackgroundColor: this.chartOptions?.multipleDataSet?.data2?.hoverBackground
      },
    ];

    this.chartjsChartOptions  = {
      ChartLabels: this.barChartLabels,
      barChartType: this.barChartType,
      barChartLegend: this.barChartLegend,
      barChartPlugins: this.barChartPlugins,
      barChartData: this.barChartData,
      chartOptions: this.chartjsChartOptionsObj,
      headingTitle: this.chartOptions?.headingTitle,
      headingSubTitle: this.chartOptions?.headingSubTitle
      }

  }

}
