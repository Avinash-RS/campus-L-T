import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoReportsComponent } from './tpo-reports.component';

describe('TpoReportsComponent', () => {
  let component: TpoReportsComponent;
  let fixture: ComponentFixture<TpoReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
