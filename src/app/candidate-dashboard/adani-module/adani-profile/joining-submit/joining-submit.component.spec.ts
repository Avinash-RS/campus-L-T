import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningSubmitComponent } from './joining-submit.component';

describe('JoiningSubmitComponent', () => {
  let component: JoiningSubmitComponent;
  let fixture: ComponentFixture<JoiningSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
