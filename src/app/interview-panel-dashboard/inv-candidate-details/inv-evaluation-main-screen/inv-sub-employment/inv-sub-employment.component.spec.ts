import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvSubEmploymentComponent } from './inv-sub-employment.component';

describe('InvSubEmploymentComponent', () => {
  let component: InvSubEmploymentComponent;
  let fixture: ComponentFixture<InvSubEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvSubEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvSubEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
