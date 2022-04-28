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
  @Input() chartType: any;
  public chartPlugins = [pluginDataLabels];
  public chartjsChartOptionsObj: ChartOptions;
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[];

  chartjsChartOptions: any;
  // ngx chart options
  ngxChartOptions = {
    chartMode: null,
    headingTitle: null,
    chartData: null,
    widthHeight: null,
    colorScheme: null,
    animations: null,
    legend: null,
    legendTitle: null,
    legendPosition: null,
    xAxis: null,
    yAxis: null,
    showGridLines: null,
    roundDomains: null,
    showXAxisLabel: null,
    showYAxisLabel: null,
    xAxisLabel: null,
    yAxisLabel: null,
    trimXAxisTicks: null,
    trimYAxisTicks: null,
    rotateXAxisTicks: null,
    maxXAxisTickLength: null,
    maxYAxisTickLength: null,
    showDataLabel: null,
    noBarWhenZero: null,
    gradient: null,
    barPadding: null,
    tooltipDisabled: null,
    roundEdges: null,
    yScale: null
  }

  constructor() {
  }

  ngOnInit() {
    this.ngxChartValueMapping();
    this.chartJSValueMapping();
  }

  ngOnChanges() {
  }

  chartJSValueMapping() {
    console.log('chartType', this.chartType);
    this.chartjsChartOptionsObj = {
      responsive: true,
      hover: {
        animationDuration: 0
      },
      animation: {
        duration: 1,
      },
      tooltips:{
        enabled : true,
        // displayColors: false,
        // backgroundColor: 'white',
        // mode: 'index',
        // titleFontColor: '#c02222',
        // bodyFontColor: '#49ae31',
        // borderColor: '#999',
        // borderWidth: 1,
        // footerFontColor:'#eee',
        // footerMarginTop:8,
        // footerSpacing:8,
        // callbacks: {
        //   label:function(tooltipItem, data){
        //     console.log('tooltipItem', tooltipItem, data);
        //     return ""
        //   }
        // }
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
          right: 0,
          top: 20,
          bottom: 0
      }
      },
      scales:{
        xAxes:[{
          offset: true,
          ticks: {
            beginAtZero: false,
            display: true,
        },
          gridLines:{
            display:false,
          },
        }],
        yAxes:[{
          offset: true,
          ticks: {
            padding: 0,
            beginAtZero: true,
            display: true,
            // min: 0,
            // max: 500,
            // stepSize:100,
            callback: function(value) {
              // console.log('value', value);
              return value + '  '
            }
          },
          gridLines:{
            display: true,
            borderDash: [1, 3],
            color: "#b3b3b3"
          }
        }],
      },
      elements:
      {
        point:
        {
          radius: 1,
          hitRadius: 5,
          hoverRadius: 10,
          hoverBorderWidth: 2
        }
      }
    }

    this.barChartLabels = this.chartOptions?.labels;
    this.barChartData = [
      {
        data: this.chartOptions?.dataSets,
        backgroundColor: this.chartOptions?.background,
        hoverBackgroundColor: this.chartOptions?.hoverBackground
      }
    ];

    this.chartjsChartOptions  = {
      ChartLabels: this.barChartLabels,
      barChartType: this.barChartType,
      barChartLegend: true,
      barChartPlugins: this.barChartPlugins,
      barChartData: this.barChartData,
      chartOptions: this.chartjsChartOptionsObj,
      headingTitle: this.chartOptions?.headingTitle
      }

  }
  ngxChartValueMapping() {
    this.ngxChartOptions.chartMode = 'chartJs'//this.chartOptions.chartMode;
    this.ngxChartOptions.headingTitle = this.chartOptions.headingTitle;
    this.ngxChartOptions.chartData = this.chartOptions.chartData;
    this.ngxChartOptions.widthHeight = this.chartOptions.widthHeight;
    this.ngxChartOptions.colorScheme = this.chartOptions.colorScheme;
    this.ngxChartOptions.animations = this.chartOptions.animations;
    this.ngxChartOptions.legend = this.chartOptions.legend;
    this.ngxChartOptions.legendTitle = this.chartOptions.legendTitle;
    this.ngxChartOptions.legendPosition = this.chartOptions.legendPosition;
    this.ngxChartOptions.xAxis = this.chartOptions.xAxis;
    this.ngxChartOptions.yAxis = this.chartOptions.yAxis;
    this.ngxChartOptions.showGridLines = this.chartOptions.showGridLines;
    this.ngxChartOptions.roundDomains = this.chartOptions.roundDomains;
    this.ngxChartOptions.showXAxisLabel = this.chartOptions.showXAxisLabel;
    this.ngxChartOptions.showYAxisLabel = this.chartOptions.showYAxisLabel;
    this.ngxChartOptions.xAxisLabel = this.chartOptions.xAxisLabel;
    this.ngxChartOptions.yAxisLabel = this.chartOptions.yAxisLabel;
    this.ngxChartOptions.trimXAxisTicks = this.chartOptions.trimXAxisTicks;
    this.ngxChartOptions.trimYAxisTicks = this.chartOptions.trimYAxisTicks;
    this.ngxChartOptions.rotateXAxisTicks = this.chartOptions.rotateXAxisTicks;
    this.ngxChartOptions.maxXAxisTickLength = this.chartOptions.maxXAxisTickLength;
    this.ngxChartOptions.maxYAxisTickLength = this.chartOptions.maxYAxisTickLength;
    this.ngxChartOptions.showDataLabel = this.chartOptions.showDataLabel;
    this.ngxChartOptions.noBarWhenZero = this.chartOptions.noBarWhenZero;
    this.ngxChartOptions.gradient = this.chartOptions.gradient;
    this.ngxChartOptions.barPadding = this.chartOptions.barPadding;
    this.ngxChartOptions.tooltipDisabled = this.chartOptions.tooltipDisabled;
    this.ngxChartOptions.roundEdges = this.chartOptions.roundEdges;
    this.ngxChartOptions.yScale = this.chartOptions.yScaleTickValue;
  }

  onSelect(event) {
    console.log(event);
  }


  // events
  // public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

}
