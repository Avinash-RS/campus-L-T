import { Component, OnInit, Input } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import moment from 'moment';

@Component({
  selector: 'app-ag-grid-shared',
  templateUrl: './ag-grid-shared.component.html',
  styleUrls: ['./ag-grid-shared.component.scss']
})
export class AgGridSharedComponent implements OnInit {
  @Input() agGridValueObj: any;
  gridApi: any;
  defaultColDef = this.appConfig.agGridWithAllFunc();
  quickSearchValue: any;
  columnDefs: any;
  paginationPageSize: any;
  cacheBlockSize: any;
  rowData: any;
  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    this.agGridValueAssign();
  // this.gridApi.setColumnDefs(this.agGridDefinition.panelList())
}

agGridValueAssign() {
  this.columnDefs = this.agGridValueObj?.columnDefs;
  this.paginationPageSize = this.agGridValueObj?.paginationPageSize;
  this.cacheBlockSize = this.agGridValueObj?.cacheBlockSize;
  this.quickSearchValue = this.agGridValueObj?.quickSearchValue;
  this.rowData = this.agGridValueObj?.rowData;
}
onGridReady(params: any) {
  this.gridApi = params.api;
}

paginationChanged(e) {

}

sortevent(e) {
}

onCellClicked(event) {
  // event['data']
}


getModel(e) {
  let filterType = e['filterInstance']['filterNameKey'];
  if (filterType == 'setFilter') {
  setTimeout(() => {
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
    }
  }, 1500);
} else {
  setTimeout(() => {
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
    }
  }, 500);
}
}

onQuickFilterChanged() {
  this.gridApi.setQuickFilter(this.quickSearchValue);
  const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
  if (filteredArray && filteredArray.length === 0) {
    this.appConfig.warning('No search results found');
    // this.toast.warning('No reuslts found');
  }
}

momentForm(date) {
  if (date) {
    const split = moment(date).format('LLL');
    return split;
  }
}


}
