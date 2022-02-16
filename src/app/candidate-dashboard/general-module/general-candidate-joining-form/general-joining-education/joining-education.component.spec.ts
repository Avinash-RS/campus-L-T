import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningEducationComponent } from './joining-education.component';

describe('JoiningEducationComponent', () => {
  let component: GeneralJoiningEducationComponent;
  let fixture: ComponentFixture<GeneralJoiningEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
