import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSubEducationComponent } from './hr-sub-education.component';

describe('HrSubEducationComponent', () => {
  let component: HrSubEducationComponent;
  let fixture: ComponentFixture<HrSubEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrSubEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrSubEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
