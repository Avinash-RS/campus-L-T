import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMainDashboardComponent } from './hr-main-dashboard.component';

describe('HrMainDashboardComponent', () => {
  let component: HrMainDashboardComponent;
  let fixture: ComponentFixture<HrMainDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrMainDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
