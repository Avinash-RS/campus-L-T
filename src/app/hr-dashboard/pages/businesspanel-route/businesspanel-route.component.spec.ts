import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesspanelRouteComponent } from './businesspanel-route.component';

describe('BusinesspanelRouteComponent', () => {
  let component: BusinesspanelRouteComponent;
  let fixture: ComponentFixture<BusinesspanelRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinesspanelRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinesspanelRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
