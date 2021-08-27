import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUploadsComponent } from './common-uploads.component';

describe('CommonUploadsComponent', () => {
  let component: CommonUploadsComponent;
  let fixture: ComponentFixture<CommonUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
