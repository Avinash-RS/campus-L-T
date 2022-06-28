import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscCollegesComponent } from './misc-colleges.component';

describe('MiscCollegesComponent', () => {
  let component: MiscCollegesComponent;
  let fixture: ComponentFixture<MiscCollegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscCollegesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
