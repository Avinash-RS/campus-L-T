import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLandingHeaderComponent } from './customer-landing-header.component';

describe('CustomerLandingHeaderComponent', () => {
  let component: CustomerLandingHeaderComponent;
  let fixture: ComponentFixture<CustomerLandingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLandingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLandingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
