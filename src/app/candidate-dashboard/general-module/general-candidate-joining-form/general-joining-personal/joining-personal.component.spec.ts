import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningPersonalComponent } from './joining-personal.component';

describe('JoiningPersonalComponent', () => {
  let component: GeneralJoiningPersonalComponent;
  let fixture: ComponentFixture<GeneralJoiningPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
