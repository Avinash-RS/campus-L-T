import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClosedComponent } from './form-closed.component';

describe('FormClosedComponent', () => {
  let component: FormClosedComponent;
  let fixture: ComponentFixture<FormClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
