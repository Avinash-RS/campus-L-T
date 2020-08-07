import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInvPanelHeaderComponent } from './shared-inv-panel-header.component';

describe('SharedInvPanelHeaderComponent', () => {
  let component: SharedInvPanelHeaderComponent;
  let fixture: ComponentFixture<SharedInvPanelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInvPanelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInvPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
