import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCampusHeaderComponent } from './off-campus-header.component';

describe('OffCampusHeaderComponent', () => {
  let component: OffCampusHeaderComponent;
  let fixture: ComponentFixture<OffCampusHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffCampusHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
