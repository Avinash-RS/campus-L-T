import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedVideoAssessViewComponent } from './shared-video-assess-view.component';

describe('SharedVideoAssessViewComponent', () => {
  let component: SharedVideoAssessViewComponent;
  let fixture: ComponentFixture<SharedVideoAssessViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedVideoAssessViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedVideoAssessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
