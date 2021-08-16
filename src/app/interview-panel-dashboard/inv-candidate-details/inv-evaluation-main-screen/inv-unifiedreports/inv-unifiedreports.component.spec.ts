import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvUnifiedreportsComponent } from './inv-unifiedreports.component';

describe('InvUnifiedreportsComponent', () => {
  let component: InvUnifiedreportsComponent;
  let fixture: ComponentFixture<InvUnifiedreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvUnifiedreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvUnifiedreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
