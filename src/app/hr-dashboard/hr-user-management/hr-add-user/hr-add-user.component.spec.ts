import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAddUserComponent } from './hr-add-user.component';

describe('HrAddUserComponent', () => {
  let component: HrAddUserComponent;
  let fixture: ComponentFixture<HrAddUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrAddUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
