import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyCriteriaComponent } from './apply-criteria.component';

describe('ApplyCriteriaComponent', () => {
  let component: ApplyCriteriaComponent;
  let fixture: ComponentFixture<ApplyCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
