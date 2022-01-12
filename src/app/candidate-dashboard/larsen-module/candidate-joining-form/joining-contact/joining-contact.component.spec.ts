import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningContactComponent } from './joining-contact.component';

describe('JoiningContactComponent', () => {
  let component: JoiningContactComponent;
  let fixture: ComponentFixture<JoiningContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
