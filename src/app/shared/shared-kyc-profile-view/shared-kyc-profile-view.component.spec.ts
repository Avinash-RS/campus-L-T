import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedKycProfileViewComponent } from './shared-kyc-profile-view.component';

describe('SharedKycProfileViewComponent', () => {
  let component: SharedKycProfileViewComponent;
  let fixture: ComponentFixture<SharedKycProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedKycProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedKycProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
