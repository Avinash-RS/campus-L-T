import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningEducationComponent } from './joining-education.component';

describe('JoiningEducationComponent', () => {
  let component: JoiningEducationComponent;
  let fixture: ComponentFixture<JoiningEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
