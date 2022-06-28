import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousMasterComponent } from './miscellaneous-master.component';

describe('MiscellaneousMasterComponent', () => {
  let component: MiscellaneousMasterComponent;
  let fixture: ComponentFixture<MiscellaneousMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscellaneousMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
