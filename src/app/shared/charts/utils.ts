export class hrDashboardDriveSummaryConfig {
  verticalChartOptions: any;
  horizontalChartOptions: any;
  funnelChartOptions: any;
  pieChartOptions: any;
  chartType: any;

  constructor(parameters) {
  }

  tpoBasedSummaryColumns() {
    return [
      // {
      //     headerName: 'S no', colId: 'icounter',
      //     minWidth: 80,
      //     sortable: true,
      //     resizable:true,
      //     filter: 'agNumberColumnFilter',
      //       valueGetter: (params) => {
      //       const i = +params.node.id + 1;
      //       return i ? i : 'Loading...';
      //     },
      // },
      {
        headerName: 'Institute / HR', field: 'hr_name', colId: 'ihr_name',
        filter: "agTextColumnFilter",
        minWidth: 140,
        sortable: true,
        tooltipField: 'hr_name',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'No. of Candidates', field: 'candidates_count', colId: 'icandidates_count',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        tooltipField: 'candidates_count',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Emails Triggered', field: 'email_triggered', colId: 'iemail_triggered',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        tooltipField: 'email_triggered',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Account Created', field: 'account_created', colId: 'iaccount_created',
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: 'account_created',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Profile Submitted', field: 'profile_submitted', colId: 'iprofile_submitted',
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: 'profile_submitted',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      // {
      //   headerName: 'Date', field: 'field_date', colId: 'ifield_date',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'field_date',
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: `Contact Person`, field: 'field_first_name', colId: 'ifield_first_name',
      //   filter: 'agSetColumnFilter',
      //   filterParams: {
      //     applyMiniFilterWhileTyping: true
      //   },
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'field_first_name',
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   },
      // },
    ];
  }

  domainBasedSummaryColumns() {
    return [
      {
        headerName: 'Domain', field: 'domain', colId: 'idomain',
        filter: "agTextColumnFilter",
        minWidth: 140,
        sortable: true,
        tooltipField: 'domain',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlisted for Assessment', field: 'shortlisted_for_assessment', colId: 'ishortlisted_for_assessment',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        tooltipField: 'shortlisted_for_assessment',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidates Appeared', field: 'candidates_appeared', colId: 'icandidates_appeared',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        tooltipField: 'candidates_appeared',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlisted for Interview', field: 'shortlisted_for_interview', colId: 'ishortlisted_for_interview',
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: 'shortlisted_for_interview',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assigned to Panel', field: 'assigned_panel', colId: 'iassigned_panel',
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: 'assigned_panel',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Interview Completed', field: 'interview_completed', colId: 'iinterview_completed',
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: 'interview_completed',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
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

  horizontalChartInit() {
    this.horizontalChartOptions = {
      headingTitle: 'Interview Summary',
      // widthHeight: undefined,
      widthHeight: [450, 290],
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

  verticalChartInit() {
    this.chartType = 'chartJS';
    if (this.chartType == 'chartJS') {
      this.verticalChartOptions = {
        headingTitle: 'Application Details',
        widthHeight: undefined,
        // widthHeight: [450, 290],
        labels: ['Total Application', 'Profile Submitted', 'Profile Shortlisted'],
        dataSets: [450, 200, 150],
        background: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
        hoverBackground: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
        legend: false,
      };
    } else {
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
          width: 500,
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

}
