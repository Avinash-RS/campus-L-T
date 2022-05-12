import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { hrDashboardDriveSummaryConfig } from 'src/app/shared/charts/utils';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

export interface status_count {
  total_application: number | 0,
  application_received: number | 0,
  shortlisted_for_assessment: number | 0,
  assessment_taken: number | 0,
  shortlisted_for_interview: number | 0,
  assigned_to_panel: number | 0,
  interview_completed: number | 0,
  candidate_selected: number | 0,
  business_unit_assigned: number | 0
}

export interface interview_summary {
  appeared: appeared
  awaiting_feedback: number | 0
  not_appeared: not_appeared
  total: number | 0
}

export interface appeared {
  selected: number | 0,
  not_selected: number | 0
}

export interface not_appeared {
  no_show: number | 0,
  request_for_reschedule: number | 0
}

export interface sc_summary {
  total: number | 0,
  mailed: number | 0,
  jf_submitted: number | 0,
  verified: number | 0
  ic_assigned: number | 0,
  pemc: number | 0
}

export interface tpoBased {
  account_created: number | 0,
  college_name: string,
  emails_triggered: number | 0,
  no_of_candidates: number | 0,
  profile_submitted: number | 0
}

export interface BUSummary {
  total: number | 0,
  company_name: string,
  accepted: number | 0,
  declined: number | 0
}

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  private hrDashboardDriveSummaryConfigInstance: hrDashboardDriveSummaryConfig;
  horizontalChartOptions: any;
  funnelChartOptions: any;
  gaugeChartOptions: any;
  tpoBasedAgGridValues: any;
  domainBasedAgGridValues: any;
  verticalComboChartOptions: any;
  summaryAPISubscription: Subscription;
  summaryAPIData: any;
  headerSummary: any;
  driveName = this.appConfig.getDriveName();
  StatusSummaryFunnalAPIData: status_count;
  InterviewSummaryhorizontalChartAPIData: interview_summary;
  SelectedCandidatesSummarygaugeChartAPIData: sc_summary;
  tpoBasedAPIData: tpoBased[];
  tpoBasedCandidatesAPISubscription: Subscription;
  BUSummaryAPIData: BUSummary[];
  disciplineBasedAPIData: any;
  domainBasedCandidatesAPISubscription: Subscription;
  buDashboardAPISubscription: Subscription;
  funnelHeading = 'Drive Summary';
  TPOHeading = 'TPO based Candidates';
  domainHeading = 'Domain wise Candidates';
  interviewSummaryHeading = 'Interview Summary';
  selectedCandidatesHeading = 'Selected Candidates Summary';
  businessSummaryHeading = 'Business Unit Summary';
  refreshSubscription: Subscription;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    this.hrDashboardDriveSummaryConfigInstance = new hrDashboardDriveSummaryConfig(null);
  }

  ngOnInit() {
    this.initialInitialization();
    this.dashboardSummaryAPI();
    this.tpoDashboardCandidatesAPI();
    this.BUDashboardCandidatesAPI();
    this.domainDashboardCandidatesAPI();
    this.refreshOndriveChangeRXJS();
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.DASHBOARD)) {
        this.summaryAPISubscription ? this.summaryAPISubscription.unsubscribe() : '';
        this.tpoBasedCandidatesAPISubscription ? this.tpoBasedCandidatesAPISubscription.unsubscribe() : '';
        this.domainBasedCandidatesAPISubscription ? this.domainBasedCandidatesAPISubscription.unsubscribe() : '';
        this.buDashboardAPISubscription ? this.buDashboardAPISubscription.unsubscribe() : '';
        this.initialInitialization();
        this.dashboardSummaryAPI();
        this.tpoDashboardCandidatesAPI();
        this.BUDashboardCandidatesAPI();
        this.domainDashboardCandidatesAPI();
        }
    });
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  initialInitialization() {
    this.headerSummary = null;
    this.initiateFunnel();
    this.initiateTPOAgGrid();
    this.initiateHorizontalChart();
    this.initiateGaugeChart();
    this.initiateVerticalComboChart();
    this.initiateDomainWiseAgGrid();
  }

  dashboardSummaryAPI() {
    this.summaryAPISubscription = this.adminService.getHRDashboardSummaryAPI().subscribe((response: any)=> {
      this.summaryAPIData = response ? response : [];
      this.headerSummary = this.summaryAPIData?.headers_count ? this.summaryAPIData?.headers_count : null;
      this.valueMapping(this.summaryAPIData);
    }, (err)=> {
      this.valueMapping(null);
    });
  }

  valueMapping(summaryData) {
    this.StatusSummaryFunnalAPIData = summaryData?.status_count;
    this.StatusSummaryFunnalAPIData ? this.funnelChartInit() : this.initiateFunnel(true);
    this.InterviewSummaryhorizontalChartAPIData = summaryData?.interview_summary;
    this.InterviewSummaryhorizontalChartAPIData ? this.horizontalChartInit() : this.initiateHorizontalChart(true);
    this.SelectedCandidatesSummarygaugeChartAPIData = summaryData?.sc_summary;
    this.SelectedCandidatesSummarygaugeChartAPIData ? this.gaugeChartInit() : this.initiateGaugeChart(true);
  }

  tpoDashboardCandidatesAPI() {
    this.tpoBasedCandidatesAPISubscription = this.adminService.getTPODashboardSummaryAPI().subscribe((response: any)=> {
      this.tpoBasedAPIData = response ? response : [];
      this.TPOBasedCandidatesAgGrid();
    }, (err)=> {
      this.initiateTPOAgGrid(true);
    });
  }

  domainDashboardCandidatesAPI() {
    this.domainBasedCandidatesAPISubscription = this.adminService.getDisciplineDashboardSummaryAPI().subscribe((response: any)=> {
      this.disciplineBasedAPIData = response ? response : [];
      this.disciplineBasedAPIData[0].assigned_to_panel = 1000;
      this.DomainBasedCandidatesAgGrid();
    }, (err)=> {
      this.initiateDomainWiseAgGrid(true);
    });
  }

  BUDashboardCandidatesAPI() {
    this.buDashboardAPISubscription = this.adminService.getBUunitSummaryAPI().subscribe((response: any)=> {
      this.BUSummaryAPIData = response ? response : [];
      let BUData = {
        labels: [],
        assigned: [],
        accepted: [],
        rejected: []
      }
      this.BUSummaryAPIData.forEach((element, i) => {
        let obj:BUSummary = element;
        if (element) {
          BUData.labels.push(obj.company_name);
          BUData.assigned.push(obj.total);
          BUData.accepted.push(obj.accepted);
          BUData.rejected.push(obj.declined);
        }
      });
      this.verticalComboChartInit(BUData);
    }, (err)=> {
      this.initiateVerticalComboChart(true);
    });
  }

  initiateFunnel(loadingFailed?:Boolean) {
    this.funnelChartOptions = {
      headingTitle: this.funnelHeading,
      loadingFailed: loadingFailed
    }
  }

  initiateTPOAgGrid(loadingFailed?:Boolean) {
    this.tpoBasedAgGridValues = {
      headingTitle: this.TPOHeading,
      loadingFailed: loadingFailed
    }
  }

  initiateDomainWiseAgGrid(loadingFailed?:Boolean) {
    this.domainBasedAgGridValues = {
      headingTitle: this.domainHeading,
      loadingFailed: loadingFailed
    }
  }

  initiateHorizontalChart(loadingFailed?:Boolean) {
    this.horizontalChartOptions = {
      headingTitle: this.interviewSummaryHeading,
      loadingFailed: loadingFailed
    }
  }

  initiateGaugeChart(loadingFailed?:Boolean) {
    this.gaugeChartOptions = {
      headingTitle: this.selectedCandidatesHeading,
      loadingFailed: loadingFailed
    }
  }

  initiateVerticalComboChart(loadingFailed?:Boolean) {
    this.verticalComboChartOptions = {
      headingTitle: this.businessSummaryHeading,
      loadingFailed: loadingFailed
    }
  }

  funnelChartInit() {
    this.funnelChartOptions = {
      data: [
        {label: 'Total Application', value: this.StatusSummaryFunnalAPIData?.total_application, backgroundColor: '#08558C', labelColor: 'fff'},
        {label: 'Application Received', value: this.StatusSummaryFunnalAPIData?.application_received, backgroundColor: '#74B3C9', labelColor: 'fff'},
        {label: 'Shortlisted for Assessment', value: this.StatusSummaryFunnalAPIData?.shortlisted_for_assessment, backgroundColor: '#CBB55F', labelColor: 'fff'},
        {label: 'Assessment Taken', value: this.StatusSummaryFunnalAPIData?.assessment_taken, backgroundColor: '#497E95', labelColor: 'fff'},
        {label: 'Shortlisted for Interview', value: this.StatusSummaryFunnalAPIData?.shortlisted_for_interview, backgroundColor: '#9174BF', labelColor: 'fff'},
        {label: 'Assigned to Panel', value: this.StatusSummaryFunnalAPIData?.assigned_to_panel, backgroundColor: '#778860', labelColor: 'fff'},
        {label: 'Interview Completed', value: this.StatusSummaryFunnalAPIData?.interview_completed, backgroundColor: '#8CA6CE', labelColor: 'fff'},
        {label: 'Candidate Selected', value: this.StatusSummaryFunnalAPIData?.candidate_selected, backgroundColor: '#CC8F8F', labelColor: 'fff'},
        {label: 'Business Unit Assigned', value: this.StatusSummaryFunnalAPIData?.business_unit_assigned, backgroundColor: '#88D376', labelColor: 'fff'}
      ],
      headingTitle: this.funnelHeading,
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
            minHeight: 40,
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

  gaugeChartInit() {
    this.gaugeChartOptions = {
      headingTitle: this.selectedCandidatesHeading,
      total: this.SelectedCandidatesSummarygaugeChartAPIData?.total,
      chartData: [
        {
          "name": `Mailed (${this.SelectedCandidatesSummarygaugeChartAPIData?.mailed})`,
          "value": this.SelectedCandidatesSummarygaugeChartAPIData?.mailed
        },
        {
          "name": `JF Submitted (${this.SelectedCandidatesSummarygaugeChartAPIData?.jf_submitted})`,
          "value": this.SelectedCandidatesSummarygaugeChartAPIData?.jf_submitted
        },
        {
          "name": `Verified (${this.SelectedCandidatesSummarygaugeChartAPIData?.verified})`,
          "value": this.SelectedCandidatesSummarygaugeChartAPIData?.verified
        },
        {
          "name": `Business Unit Assigned (${this.SelectedCandidatesSummarygaugeChartAPIData?.ic_assigned})`,
          "value": this.SelectedCandidatesSummarygaugeChartAPIData?.ic_assigned
        },
        {
          "name": `Pre Employment Medical Checkup (${this.SelectedCandidatesSummarygaugeChartAPIData?.pemc})`,
          "value": this.SelectedCandidatesSummarygaugeChartAPIData?.pemc
        }
      ],
      widthHeight: undefined,//[490, 400],
      colorScheme: {domain: ['#1F78B4', '#5FCEFF', '#2A94C3', '#E6D263', '#49AE31'] },
      animations: true,
      legend: true,
      units: 'Total',
      legendTitle: '',
      legendPosition: 'below',
      showText: false,
      min: 0,
      max: this.SelectedCandidatesSummarygaugeChartAPIData?.total > 10 ? this.SelectedCandidatesSummarygaugeChartAPIData?.total : 10,
      bigSegments: 10,
      smallSegments: 0,
      showAxis: true,
      tooltipDisabled: false
    }
  }

  TPOBasedCandidatesAgGrid() {
    let columnDefs = this.hrDashboardDriveSummaryConfigInstance.tpoBasedSummaryColumns();
    this.tpoBasedAgGridValues =
    {
      headingTitle: this.TPOHeading,
      columnDefs: columnDefs,
      paginationPageSize: 500,
      cacheBlockSize: 500,
      quickSearchValue: '',
      rowData: this.tpoBasedAPIData
    }
  }

  DomainBasedCandidatesAgGrid() {
    let columnDefs = this.hrDashboardDriveSummaryConfigInstance.domainBasedSummaryColumns();
    this.domainBasedAgGridValues = {
      headingTitle: this.domainHeading,
      columnDefs: columnDefs,
      paginationPageSize: 500,
      cacheBlockSize: 500,
      quickSearchValue: '',
      rowData: this.disciplineBasedAPIData
    }
  }

  horizontalChartInit() {
      this.horizontalChartOptions = {
        headingTitle: this.interviewSummaryHeading,
        headingSubTitle: this.InterviewSummaryhorizontalChartAPIData?.total,
        widthHeight: undefined,
        labels: ['Appeared for Interview', 'Not Appeared for Interview', 'Awaiting Feedback'],
        multipleDataSet: {
          data1: {
            dataSets: [this.InterviewSummaryhorizontalChartAPIData?.appeared?.selected, this.InterviewSummaryhorizontalChartAPIData?.not_appeared?.request_for_reschedule, this.InterviewSummaryhorizontalChartAPIData?.awaiting_feedback],
            background: ['#5AA454', '#2F86A2', '#E2BF37'],
            hoverBackground: ['#5AA454', '#2F86A2', '#E2BF37']
          },
          data2: {
            dataSets: [this.InterviewSummaryhorizontalChartAPIData?.appeared?.not_selected, this.InterviewSummaryhorizontalChartAPIData?.not_appeared?.no_show],
            background: ['#BCE3AD', '#A1CDDB', '#E2BF37'],
            hoverBackground: ['#BCE3AD', '#A1CDDB', '#E2BF37']
          },
        },
        legend: false,
      };
  }

  verticalComboChartInit(responseData) {
    this.verticalComboChartOptions = {
      headingTitle: this.businessSummaryHeading,
      chartTitle: 'Company List',
      widthHeight: [400, 300],
      labels: responseData.labels,
      data: {
          dataSets: [
            {
              label: 'Assigned',
              barThickness: 30,
              data: responseData.assigned,
              borderColor:'#23A4C9',
              backgroundColor:'#23A4C9',
              hoverBackgroundColor: '#23A4C9',
              type: 'bar',
              order: 2
            },
            {
              label: 'Accepted',
              barThickness: 30,
              data: responseData.accepted,
              borderColor:'#33A02B',
              backgroundColor:'#33A02B',
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#33A02B',
              fill: false,
              type: 'line',
              order: 0
            },
            {
              label: 'Rejected',
              barThickness: 30,
              data: responseData.rejected,
              borderColor: '#BD2020',
              backgroundColor: '#BD2020',
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#BD2020',
              fill: false,
              type: 'line',
              order: 1
            }
          ],
      },
      legend: true,
    };
  }

  ngOnDestroy() {
    this.summaryAPISubscription ? this.summaryAPISubscription.unsubscribe() : '';
    this.tpoBasedCandidatesAPISubscription ? this.tpoBasedCandidatesAPISubscription.unsubscribe() : '';
    this.domainBasedCandidatesAPISubscription ? this.domainBasedCandidatesAPISubscription.unsubscribe() : '';
    this.buDashboardAPISubscription ? this.buDashboardAPISubscription.unsubscribe() : '';
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

}
