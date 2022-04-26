import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {

  verticalChartOptions: any;
  horizontalChartOptions: any;
  pieChartOptions: any;
  constructor() { }

  ngOnInit() {
    this.verticalChartInit();
    this.horizontalChartInit();
    this.pieChartInit();
  }

  verticalChartInit() {
    this.verticalChartOptions = {
      headingTitle: 'Application Details',
      widthHeight: undefined,
      // widthHeight: [450, 290],
      chartData: [
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
      maxXAxisTickLength: 25,
      maxYAxisTickLength: 25,
      showDataLabel: true,
      noBarWhenZero: true,
      gradient: false,
      barPadding: 30,
      tooltipDisabled: false,
      roundEdges: false,
      yScaleTickValue: 100
    };
  }

  horizontalChartInit() {
    this.horizontalChartOptions = {
      headingTitle: 'Application Details',
      widthHeight: undefined,
      // widthHeight: [450, 290],
      chartData: [
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
      maxXAxisTickLength: 25,
      maxYAxisTickLength: 25,
      showDataLabel: true,
      noBarWhenZero: true,
      gradient: false,
      barPadding: 30,
      tooltipDisabled: false,
      roundEdges: false,
      yScaleTickValue: 100
    };
  }

  pieChartInit() {
    this.pieChartOptions = {
      headingTitle: 'Pie Chart',
      widthHeight: undefined,
      // widthHeight: [450, 290],
      chartData: [
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
      labels: true,
      trimLabels: true,
      maxLabelLength: 30,
      legend: true, // Show legend or not
      legendTitle: 'Legend',
      legendPosition: 'right', // ['right', 'below'],
      explodeSlices: false,
      doughnut: false,
      arcWidth: 0.25,
      gradient: false,
      tooltipDisabled: false
    };
  }


}
