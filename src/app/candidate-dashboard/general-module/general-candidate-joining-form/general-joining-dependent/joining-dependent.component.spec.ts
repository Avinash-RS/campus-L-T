import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningDependentComponent } from './joining-dependent.component';

describe('JoiningDependentComponent', () => {
  let component: GeneralJoiningDependentComponent;
  let fixture: ComponentFixture<GeneralJoiningDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningDependentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
