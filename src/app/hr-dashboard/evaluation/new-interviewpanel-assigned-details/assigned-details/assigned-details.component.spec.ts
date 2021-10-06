import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDetailsComponent } from './assigned-details.component';

describe('AssignedDetailsComponent', () => {
  let component: AssignedDetailsComponent;
  let fixture: ComponentFixture<AssignedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
