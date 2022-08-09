import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgProgressBarComponent } from './ag-progress-bar.component';

describe('AgProgressBarComponent', () => {
  let component: AgProgressBarComponent;
  let fixture: ComponentFixture<AgProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
