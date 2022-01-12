import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningUploadComponent } from './joining-upload.component';

describe('JoiningUploadComponent', () => {
  let component: JoiningUploadComponent;
  let fixture: ComponentFixture<JoiningUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoiningUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
