import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvSubEducationComponent } from './inv-sub-education.component';

describe('InvSubEducationComponent', () => {
  let component: InvSubEducationComponent;
  let fixture: ComponentFixture<InvSubEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvSubEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvSubEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
