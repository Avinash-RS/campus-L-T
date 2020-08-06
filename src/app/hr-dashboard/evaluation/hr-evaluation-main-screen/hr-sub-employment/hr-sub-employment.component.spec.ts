import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSubEmploymentComponent } from './hr-sub-employment.component';

describe('HrSubEmploymentComponent', () => {
  let component: HrSubEmploymentComponent;
  let fixture: ComponentFixture<HrSubEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrSubEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrSubEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
