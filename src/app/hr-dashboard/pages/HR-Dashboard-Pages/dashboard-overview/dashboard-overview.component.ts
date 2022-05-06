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
  domainBasedAgGridValues: any;
  chartType: string;
  constructor() {
    this.hrDashboardDriveSummaryConfigInstance = new hrDashboardDriveSummaryConfig(null);
  }

  ngOnInit() {
    this.horizontalChartInit();
    this.funnelChartInit();
    this.TPOBasedCandidatesAgGrid();
    this.DomainBasedCandidatesAgGrid();
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

  DomainBasedCandidatesAgGrid() {
    let columnDefs = this.hrDashboardDriveSummaryConfigInstance.domainBasedSummaryColumns();
    this.domainBasedAgGridValues = {
      headingTitle: 'Domain wise Candidates',
      columnDefs: columnDefs,
      paginationPageSize: 500,
      cacheBlockSize: 500,
      quickSearchValue: '',
      rowData: []
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
    this.chartType = 'chartJS';
      this.horizontalChartOptions = {
        headingTitle: 'Interview Summary',
        headingSubTitle: '2780',
        widthHeight: undefined,
        labels: ['Appeared for Interview', 'Not Appeared for Interview', 'Awaiting Feedback'],
        singleDataSet: {
          dataSets: [1000, 200, 150],
          background: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
          hoverBackground: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
        },
        multipleDataSet: {
          data1: {
            dataSets: [1500, 400, 950],
            background: ['#5AA454', '#2F86A2', '#E2BF37'],
            hoverBackground: ['#5AA454', '#2F86A2', '#E2BF37']
          },
          data2: {
            dataSets: [500, 10],
            background: ['#BCE3AD', '#A1CDDB', '#E2BF37'],
            hoverBackground: ['#BCE3AD', '#A1CDDB', '#E2BF37']
          },
        },
        legend: false,
      };
  }



}
