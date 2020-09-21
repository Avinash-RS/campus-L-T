import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCloseComponent } from './registration-close.component';

describe('RegistrationCloseComponent', () => {
  let component: RegistrationCloseComponent;
  let fixture: ComponentFixture<RegistrationCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
