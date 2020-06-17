import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMasterComponent } from './hr-master.component';

describe('HrMasterComponent', () => {
  let component: HrMasterComponent;
  let fixture: ComponentFixture<HrMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
