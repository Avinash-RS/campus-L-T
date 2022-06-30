import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCampusProfileComponent } from './off-campus-profile.component';

describe('OffCampusProfileComponent', () => {
  let component: OffCampusProfileComponent;
  let fixture: ComponentFixture<OffCampusProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffCampusProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
