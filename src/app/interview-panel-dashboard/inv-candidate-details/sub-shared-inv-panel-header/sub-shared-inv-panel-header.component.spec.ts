import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSharedInvPanelHeaderComponent } from './sub-shared-inv-panel-header.component';

describe('SubSharedInvPanelHeaderComponent', () => {
  let component: SubSharedInvPanelHeaderComponent;
  let fixture: ComponentFixture<SubSharedInvPanelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSharedInvPanelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSharedInvPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
