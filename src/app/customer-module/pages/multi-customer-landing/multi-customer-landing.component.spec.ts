import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCustomerLandingComponent } from './multi-customer-landing.component';

describe('MultiCustomerLandingComponent', () => {
  let component: MultiCustomerLandingComponent;
  let fixture: ComponentFixture<MultiCustomerLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCustomerLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCustomerLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
