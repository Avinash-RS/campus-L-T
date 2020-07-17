import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoRecruitmentComponent } from './tpo-recruitment.component';

describe('TpoRecruitmentComponent', () => {
  let component: TpoRecruitmentComponent;
  let fixture: ComponentFixture<TpoRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
