import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningDependentComponent } from './joining-dependent.component';

describe('JoiningDependentComponent', () => {
  let component: JoiningDependentComponent;
  let fixture: ComponentFixture<JoiningDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningDependentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
