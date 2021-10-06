import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSubAssessmentsComponent } from './hr-sub-assessments.component';

describe('HrSubAssessmentsComponent', () => {
  let component: HrSubAssessmentsComponent;
  let fixture: ComponentFixture<HrSubAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrSubAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrSubAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
