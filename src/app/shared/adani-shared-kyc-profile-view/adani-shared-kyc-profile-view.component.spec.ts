import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaniSharedKycProfileViewComponent } from './adani-shared-kyc-profile-view.component';

describe('AdaniSharedKycProfileViewComponent', () => {
  let component: AdaniSharedKycProfileViewComponent;
  let fixture: ComponentFixture<AdaniSharedKycProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaniSharedKycProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaniSharedKycProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
