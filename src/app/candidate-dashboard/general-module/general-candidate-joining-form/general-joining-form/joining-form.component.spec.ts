import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningFormComponent } from './joining-form.component';

describe('JoiningFormComponent', () => {
  let component: GeneralJoiningFormComponent;
  let fixture: ComponentFixture<GeneralJoiningFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
