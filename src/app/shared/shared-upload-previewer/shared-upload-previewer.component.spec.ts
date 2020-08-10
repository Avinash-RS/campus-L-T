import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUploadPreviewerComponent } from './shared-upload-previewer.component';

describe('SharedUploadPreviewerComponent', () => {
  let component: SharedUploadPreviewerComponent;
  let fixture: ComponentFixture<SharedUploadPreviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUploadPreviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUploadPreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
