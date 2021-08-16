import { AfterViewInit, Input } from "@angular/core";
import { Component, OnInit, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, OnChanges {
  // chart start
  canvas: any;
  ctx: any;
  @ViewChild('myChart', {static: false}) private chartContainer: ElementRef;
  @Input('chartType') type: any;
  @Input('values') chartValues: any;
  @Input('labels') chartLabels: any;
  @Input('orientation') orient: any;
// chart end

// ngx charts start
@Output() selectedArea:EventEmitter<any> =new EventEmitter<any>();
@Input() chartData: any;
@Input() domains: any;
indexNum: any = 1;
single: any;
view: any[] = [480, 450];

// options
showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = false;
showXAxisLabel = false;
barPadding = 12;
xAxisLabel = 'Skill Score';
showYAxisLabel = false;
yAxisLabel = 'Skill Score';
colorScheme = {
  domain: []
};
yAxisTicks = [0, 40, 80, 100];
// ngx charts end

  constructor() {

  }
  async ngOnInit() {
    await this.getSkillData();
    this.calculateWidthAndHeight();
    this.setColorDomain();
  }

  async ngOnChanges() {
    await this.getSkillData();
    this.calculateWidthAndHeight();
    this.setColorDomain();
  }

  setColorDomain() {
    this.colorScheme.domain = this.domains;
  }

  getSkillData() {
    this.single = [];
    let colorCode = [];
    this.chartData.forEach(element => {
      if (element) {
        let ele = {
          name: element.skillname,
          value: element.score,
          id: element.skillID,
          color: element.areaColor
        }
        colorCode.push(element.areaColor);
        this.single.push(ele);
      }
    });
    this.colorScheme.domain = colorCode;
  }

  ngAfterViewInit() {
  }


  calculateWidthAndHeight() {
    if (this.single && this.single.length <= 1) {
      return this.view = [480, 75];
     }
    if (this.single && this.single.length <= 2) {
      return this.view = [480, 100];
     }
    if (this.single && this.single.length <= 3) {
     return this.view = [480, 120];
    }
    if (this.single && this.single.length <= 5) {
      return this.view = [480, 190];
    }
    if (this.single && this.single.length <= 7) {
      return this.view = [480, 262];
    }
    if (this.single && this.single.length <= 9) {
      return this.view = [480, 334];
    }
    if (this.single && this.single.length <= 11) {
      return this.view = [480, 406];
    }
  }

  onSelect(event) {
    this.selectedArea.emit(event);
  }

  sorting(data) {
    let sortingArray = this.single;
    this.single = [];
    data = data > 2 ? 1 : data;
    if (data == 1) {
      this.indexNum = data;
      sortingArray.sort(function(a, b) {
        return Number(a.value) < Number(b.value) ? -1 : 1;
      });
      let colorCode = [];
      sortingArray.forEach(element => {
        colorCode.push(element.color);
        this.single.push(element);
      });
      this.colorScheme.domain = colorCode;
    }
    else if (data == 2) {
      this.indexNum = data;
      sortingArray.sort(function(a, b) {
        return Number(a.value) > Number(b.value) ? -1 : 1;
      });
      let colorCode = [];
      sortingArray.forEach(element => {
        colorCode.push(element.color);
        this.single.push(element);
      });
      this.colorScheme.domain = colorCode;
    } else {
      // this.indexNum = 0;
      // this.getSkillData();
    }
  }

  chartjs() {
    this.canvas = this.chartContainer.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    let chartdata:any = {
      labels: this.chartLabels,
      datasets: [{
        label: 'Skill Score',
        data: this.chartValues,
        backgroundColor: ['#8ac1ed', '#a4dea5', '#f7d096', '#e89694'],
      borderWidth: 0,
      borderRadius:0
      }]
  }
  // this.type==="radar"?chartdata.datasets[0].fillColor = "rgba(255,10,13,255)":''

    let myChart = new Chart(this.ctx, {
    type: this.type,
    data:chartdata,
    options: {
      responsive: false,
      legend: {
        display: false
     },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
      indexAxis: this.orient,
      scaleShowLabels : false
    },
  //   options: {
  //   indexAxis: this.orient,
  // }
    });
  }
}
