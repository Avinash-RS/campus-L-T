import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningUploadComponent } from './joining-upload.component';

describe('JoiningUploadComponent', () => {
  let component: GeneralJoiningUploadComponent;
  let fixture: ComponentFixture<GeneralJoiningUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralJoiningUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
