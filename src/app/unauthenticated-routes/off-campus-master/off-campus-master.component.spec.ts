import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCampusMasterComponent } from './off-campus-master.component';

describe('OffCampusMasterComponent', () => {
  let component: OffCampusMasterComponent;
  let fixture: ComponentFixture<OffCampusMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffCampusMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
