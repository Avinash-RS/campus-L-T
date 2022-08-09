import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-progress-bar',
  templateUrl: './ag-progress-bar.component.html',
  styleUrls: ['./ag-progress-bar.component.scss']
})
export class AgProgressBarComponent implements ICellRendererAngularComp {
  public cellValue!: any;

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
      this.cellValue = this.getValueToDisplay(params);
    }
  
    // gets called whenever the user gets the cell to refresh
    refresh(params: ICellRendererParams) {
      // set value into cell again
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
    
    getValueToDisplay(params: ICellRendererParams) {
      return {
        received_count: params.valueFormatted ? Number(params.valueFormatted) : (params.value ? Number(params.value) : 0),
        panel_count: params?.data?.panel_count ? Number(params?.data?.panel_count) : 0
      } 
    }

}
