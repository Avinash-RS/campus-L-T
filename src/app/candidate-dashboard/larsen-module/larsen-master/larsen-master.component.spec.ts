import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LarsenMasterComponent } from './larsen-master.component';

describe('LarsenMasterComponent', () => {
  let component: LarsenMasterComponent;
  let fixture: ComponentFixture<LarsenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LarsenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LarsenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
