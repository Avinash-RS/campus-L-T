import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { MatDialog } from '@angular/material';
import moment from 'moment';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidate-book-slot',
  templateUrl: './candidate-book-slot.component.html',
  styleUrls: ['./candidate-book-slot.component.scss']
})
export class CandidateBookSlotComponent implements OnInit {
  @ViewChild('confirmation', {static: true}) confirmationDialog: TemplateRef<any>;
  @ViewChild('confirmed', {static: true}) slotConfirmed: TemplateRef<any>;
  slotsArray: any;
  driveName: any;
  constructor(
    private appconfig: AppConfigService,
    protected matdialog: MatDialog,
    private candidateservice: CandidateMappersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getSlots();
    this.getRouteParams();
  }

  backtoCandidateDashboard() {
    this.appconfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.CANDIDATE_DASHBOARD);
  }

  getRouteParams() {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.driveName = params?.params?.dId;
    });
  }

  getSlots() {
    const apiData = {
      email: this.appconfig.getLocalData('userEmail')
    };
    this.candidateservice.getAssessmentSlots(apiData).subscribe((res: any) => {
      this.slotsArray = res && res.slots && res.slots.length > 0 ? res.slots : [];
    }, (err) => {

    });
  }

  slotConfirmation(parentIndex, ChildIndex) {
    const selectedParentSlot = this.slotsArray[parentIndex];
    const selectedChildSlot = this.slotsArray[parentIndex].slots[ChildIndex];
    if (selectedChildSlot.remaining_count > 0) {
      const slotConfirmationref = this.matdialog.open(this.confirmationDialog, {
        width: '400px',
        height: 'auto',
        autoFocus: false,
        id: 'slot1',
        data: {selectedParentSlot, selectedChildSlot},
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'slotConfirmation'
      });
      slotConfirmationref.afterClosed().subscribe((res: any) => {
        if (res) {
          this.slotBookAPI(selectedChildSlot?.slot_id);
        }
      });
    }
  }

  slotBookAPI(slotId) {
    const apiData = {
      email: this.appconfig.getLocalData('userEmail'),
      slot_id: slotId
    };
    this.candidateservice.BookAssessmentSlots(apiData).subscribe((res: any) => {
      this.slotConfirmedPopup();
    }, (err) => {
      if (err?.error?.slots && err?.error?.slots.length > 0) {
        this.slotsArray = err?.error?.slots;
      }
    });
  }

  slotConfirmedPopup() {
      const slotConfirmedref = this.matdialog.open(this.slotConfirmed, {
        width: '400px',
        height: 'auto',
        autoFocus: false,
        id: 'slot2',
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'slotConfirmed'
      });
  }

  slotBooked() {
    this.matdialog.closeAll();
    this.appconfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.CANDIDATE_DASHBOARD);
  }

  momentFormDate(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      return split;
    }
  }
  
}
