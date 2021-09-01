import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadsComponent } from './bulk-uploads.component';

describe('BulkUploadsComponent', () => {
  let component: BulkUploadsComponent;
  let fixture: ComponentFixture<BulkUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
