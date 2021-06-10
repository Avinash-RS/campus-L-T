import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonJoiningFormComponent } from './common-joining-form.component';

describe('CommonJoiningFormComponent', () => {
  let component: CommonJoiningFormComponent;
  let fixture: ComponentFixture<CommonJoiningFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonJoiningFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonJoiningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
