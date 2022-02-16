import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningWorkDetailsComponent } from './joining-work-details.component';

describe('JoiningWorkDetailsComponent', () => {
  let component: GeneralJoiningWorkDetailsComponent;
  let fixture: ComponentFixture<GeneralJoiningWorkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningWorkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
