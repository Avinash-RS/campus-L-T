import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridSharedComponent } from './ag-grid-shared.component';

describe('AgGridSharedComponent', () => {
  let component: AgGridSharedComponent;
  let fixture: ComponentFixture<AgGridSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
