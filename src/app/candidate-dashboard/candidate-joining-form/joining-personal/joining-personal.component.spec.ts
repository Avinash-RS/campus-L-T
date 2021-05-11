import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningPersonalComponent } from './joining-personal.component';

describe('JoiningPersonalComponent', () => {
  let component: JoiningPersonalComponent;
  let fixture: ComponentFixture<JoiningPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
