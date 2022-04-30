import { Component, OnInit } from '@angular/core';
import { hrDashboardDriveSummaryConfig } from 'src/app/shared/charts/utils';
@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {

  private hrDashboardDriveSummaryConfigInstance: hrDashboardDriveSummaryConfig;
  horizontalChartOptions: any;
  funnelChartOptions: any;
  tpoBasedAgGridValues: any;
  constructor() {
    this.hrDashboardDriveSummaryConfigInstance = new hrDashboardDriveSummaryConfig(null);
  }

  ngOnInit() {
    this.horizontalChartInit();
    this.funnelChartInit();
    this.TPOBasedCandidatesAgGrid();
  }

  TPOBasedCandidatesAgGrid() {
    let columnDefs = this.hrDashboardDriveSummaryConfigInstance.tpoBasedSummaryColumns();
    this.tpoBasedAgGridValues = {
      headingTitle: 'TPO based Candidates',
      columnDefs: columnDefs,
      paginationPageSize: 500,
      cacheBlockSize: 500,
      quickSearchValue: '',
      rowData: [
        {
          hr_name: 'SRM Institute of Engineering and Technology',
          candidates_count: 150,
          email_triggered: 100,
          account_created: 80,
          profile_submitted: 70
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
        {
          hr_name: 'Avinash last',
          candidates_count: 250,
          email_triggered: 150,
          account_created: 100,
          profile_submitted: 90
        },
      ]
    }
  }

  funnelChartInit() {
    this.funnelChartOptions = {
      data: [
        {label: 'Total Application', value: 450, backgroundColor: '#08558C', labelColor: 'fff'},
        {label: 'Application Received', value: 250, backgroundColor: '#74B3C9', labelColor: 'fff'},
        {label: 'Shortlisted for Assessment', value: 150, backgroundColor: '#CBB55F', labelColor: 'fff'},
        {label: 'Assessment Taken', value: 140, backgroundColor: '#497E95', labelColor: 'fff'},
        {label: 'Shortlisted for Assessment', value: 130, backgroundColor: '#9174BF', labelColor: 'fff'},
        {label: 'Assigned to Panel', value: 100, backgroundColor: '#778860', labelColor: 'fff'},
        {label: 'Interview Completed', value: 80, backgroundColor: '#8CA6CE', labelColor: 'fff'},
        {label: 'Candidate Selected', value: 50, backgroundColor: '#CC8F8F', labelColor: 'fff'},
        {label: 'IC Assigned', value: 40, backgroundColor: '#88D376', labelColor: 'fff'}
      ],
      headingTitle: 'Drive Summary',
      options: {
        chart: {
          height: 380,
          bottomPinch: 1,
          bottomWidth: 1/3,
          animate: 150
        },
        block: {
            dynamicHeight: true,
            dynamicSlope: false,
            highlight: true,
            minHeight: 33,
        },
        tooltip: {
            enabled: true
        },
        events: {
          click: {
            block(data, d) {
            }
          }
        },
        label: {
            format: '{l}\n{f}'
        }
      }
    }
  }

  horizontalChartInit() {
    this.horizontalChartOptions = {
      headingTitle: 'Interview Summary',
      // widthHeight: undefined,
      // widthHeight: [450, 290],
      chartData: [
        {
          "name": "Appeared for Interview",
          "series": [
            {
              "name": "Selected",
              "value": 70
            },
            {
              "name": "Rejected",
              "value": 10
            }
          ]
        },
        {
          "name": "Not Appeared for Interview",
          "series": [
            {
              "name": "Reschedule",
              "value": 20
            },
            {
              "name": "No Show",
              "value": 30
            }
          ]
        },
        {
          "name": "Awaiting Feedback",
          "series": [
            {
              "name": "Inprogress",
              "value": 20
            },
          ]
        }
      ],
      colorScheme: {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#08558C']
      },
      animations: true,
      legend: true, // Show legend or not
      legendTitle: 'Legend',
      legendPosition: 'below', // ['right', 'below'],
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
      yScaleTickValue: 200
    };
  }



}
