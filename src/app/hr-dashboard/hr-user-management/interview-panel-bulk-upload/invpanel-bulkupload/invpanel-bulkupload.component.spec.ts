import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvpanelBulkuploadComponent } from './invpanel-bulkupload.component';

describe('InvpanelBulkuploadComponent', () => {
  let component: InvpanelBulkuploadComponent;
  let fixture: ComponentFixture<InvpanelBulkuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvpanelBulkuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvpanelBulkuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
