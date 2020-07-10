import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoMasterComponent } from './tpo-master.component';

describe('TpoMasterComponent', () => {
  let component: TpoMasterComponent;
  let fixture: ComponentFixture<TpoMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
