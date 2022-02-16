import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningContactComponent } from './joining-contact.component';

describe('JoiningContactComponent', () => {
  let component: GeneralJoiningContactComponent;
  let fixture: ComponentFixture<GeneralJoiningContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
