import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaniMasterComponent } from './adani-master.component';

describe('AdaniMasterComponent', () => {
  let component: AdaniMasterComponent;
  let fixture: ComponentFixture<AdaniMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaniMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaniMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
