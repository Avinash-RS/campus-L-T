import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningPreviewComponent } from './joining-preview.component';

describe('JoiningPreviewComponent', () => {
  let component: GeneralJoiningPreviewComponent;
  let fixture: ComponentFixture<GeneralJoiningPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
