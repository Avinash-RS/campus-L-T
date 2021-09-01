import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from '../../modal-box/modal-box.component';
import { MatDialog } from '@angular/material';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { Injectable } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Injectable({
  providedIn: 'root'
})

export class userListDefinition {
  selectedUserDetail: any; // Interview panel about to delete user id
  constructor(private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
    ) {

  }

  candidateList() {
    return [
      {
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        minWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        resizable: false,
        suppressMenu: true,
        field: 'candidate_id',
        headerName: '',
        // colId: 'cheader'
      },
      {
        headerName: 'S no', //colId: 'csno',
        field: 'counter',
        filter: false,
        minWidth: 80,
        maxWidth: 80,
        sortable: false,
        resizable:true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Tag', field: 'tag_name', //colId: 'ctag_name',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'tag_name',
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'candidate_name', //colId: 'ccandidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Id', field: 'candidate_id', //colId: 'ccandidate_id',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        filterParams: {
          filterOptions: ['lessThanOrEqual', 'greaterThanOrEqual', 'inRange']
        },
        sortable: true,
        resizable:true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Id', field: 'email', //colId: 'cemail',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 250,
        sortable: true,
        resizable:true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploader_name', //colId: 'cuploader_name',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'uploader_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploader Role', field: 'uploader_role', //colId: 'cuploader_role',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: params => {
              // async update simulated using setTimeout()
              setTimeout(() => {
                  // fetch values from server
                  const values = ['Institute', 'HR'];
                  // supply values to the set filter
                  params.success(values);
              }, 1000);
        },
      },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'uploader_role',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date of Upload', field: 'created_date', //colId: 'ccreated_date',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 160,
        sortable: true,
        resizable:true,
        tooltipField: 'created_date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Mail Sent', field: 'email_sent', //colId: 'cemail_sent',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: params => {
              // async update simulated using setTimeout()
              setTimeout(() => {
                  // fetch values from server
                  const values = ['Sent', 'Not Sent'];
                  // supply values to the set filter
                  params.success(values);
              }, 1000);
        },
        },
        cellClass: 'mail-sent',
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'email_sent',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

  }
  panelList() {
    return [
      {
        headerName: 'S no', colId: 'psno',
        field: 'counter',
        filter: 'agNumberColumnFilter',
        minWidth: 80,
        sortable: true,
        resizable:true,
        tooltipField: 'counter',
        filterParams: {
          buttons: ['reset'],
        },
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'name', colId: 'pname',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Id', field: 'email', colId: 'pemail',
        filter: 'agTextColumnFilter',
        minWidth: 250,
        sortable: true,
        resizable:true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Role', field: 'role', colId: 'prole',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'role',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Employee Id', field: 'field_employee_id', colId: 'pfield_employee_id',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'field_employee_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'field_panel_discipline', colId: 'pfield_panel_discipline',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'field_panel_discipline',
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'field_uploaded_by', colId: 'pfield_uploaded_by',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'field_uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Delete', field: 'user_id', colId: 'inv',
        filter: false,
        sortable: false,
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center' },
        cellRenderer: (params) => {
          return `<button class="submit agTable" mat-raised-button><span style="margin-right: .25em;"><img src="assets/images/delete-white-18dp.svg" alt="" srcset=""></span><span> Remove</span></button>`;
        },
        minWidth: 120,
      }
    ];
  }

  instituteList() {
    return [
      {
        headerName: 'S no', field: 'counter', colId: 'icounter',
        filter: 'agNumberColumnFilter',
        minWidth: 85,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute name', field: 'field_institute_name', colId: 'ifield_institute_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_name',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute Id', field: 'id', colId: 'iid',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'id',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute email Id', field: 'email', colId: 'iemail',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'State', field: 'field_institute_state', colId: 'ifield_institute_state',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_state',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'City', field: 'field_institute_city', colId: 'ifield_institute_city',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_city',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'field_date', colId: 'ifield_date',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: `Contact person`, field: 'field_first_name', colId: 'ifield_first_name',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_first_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: 'Job title', field: 'field_institute_title', colId: 'ifield_institute_title',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_title',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Mobile number', field: 'field_institute_mobile_number', colId: 'ifield_institute_mobile_number',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_mobile_number',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Comments', field: 'field_insitute_comments', colId: 'ifield_institute_comments',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_insitute_comments',
        getQuickFilterText: (params) => {
          return params.value;
        },
        valueGetter: (params) => {
          return params.data.field_insitute_comments ? params.data.field_insitute_comments : '-';
        },
      },
      {
        headerName: 'Status', field: 'admin_status', colId: 'iadmin_status',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'admin_status',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          if (params &&  params['data'] && params['data']['admin_status'] == 'Approved') {
            return `<span class="green-1"> Approved </span>`;
          }
          if (params &&  params['data'] && params['data']['admin_status'] == 'Rejected') {
            return `<span class="red-1"> Rejected </span>`;
          } else {
            return `-`;
          }
        },
      },
    ];
  }

  hrList() {
    return [
      {
        headerName: 'S no', field: 'counter', colId: 'hcounter',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'name', colId: 'hname',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Id', field: 'email', colId: 'hemail',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Role', field: 'roles_target_id', colId: 'hroles_target_id',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'roles_target_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Delete', field: 'user_id', colId: 'hr',
        filter: false,
        sortable: false,
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center' },
        cellRenderer: (params) => {
          return `<button class="submit agTable" mat-raised-button><span style="margin-right: .25em;"><img src="assets/images/delete-white-18dp.svg" alt="" srcset=""></span><span> Remove</span></button>`;
        },
        minWidth: 140,
      }
    ];
  }

  // Interview panel delete function
  removeUser(userDetail) {
    this.selectedUserDetail = userDetail;
    const data = {
      iconName: '',
      dataToBeShared: {
        confirmText: 'Are you sure you want to delete this user?',
        componentData: userDetail,
        type: 'remove',
        identity: 'user-list-delete'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
   this.openDialog(ModalBoxComponent, data);
  }

  openDialog(component, data) {
    let dialogDetails: any;
    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.deleteUser();
      }
    });
  }

  deleteUser() {
    const removeUser = {
      'user_id': this.selectedUserDetail.user_id
    };
    this.adminService.hrDeleteUser(removeUser).subscribe((success: any) => {
      this.appConfig.success(`User has been removed Successfully`, '');
      setTimeout(() => {
        this.sharedService.commonUserListRefresh.next();
      }, 1000);
    }, (error) => {
      return false;
    });
  }


}
