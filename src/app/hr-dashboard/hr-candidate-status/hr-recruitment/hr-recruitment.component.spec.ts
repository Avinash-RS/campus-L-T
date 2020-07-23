import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRecruitmentComponent } from './hr-recruitment.component';

describe('HrRecruitmentComponent', () => {
  let component: HrRecruitmentComponent;
  let fixture: ComponentFixture<HrRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
