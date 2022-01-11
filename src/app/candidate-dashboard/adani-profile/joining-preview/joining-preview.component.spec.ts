import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningPreviewComponent } from './joining-preview.component';

describe('JoiningPreviewComponent', () => {
  let component: JoiningPreviewComponent;
  let fixture: ComponentFixture<JoiningPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
