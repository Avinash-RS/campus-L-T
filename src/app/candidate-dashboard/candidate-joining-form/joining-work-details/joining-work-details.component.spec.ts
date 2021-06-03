import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningWorkDetailsComponent } from './joining-work-details.component';

describe('JoiningWorkDetailsComponent', () => {
  let component: JoiningWorkDetailsComponent;
  let fixture: ComponentFixture<JoiningWorkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningWorkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
