import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddICComponent } from './add-ic.component';

describe('AddICComponent', () => {
  let component: AddICComponent;
  let fixture: ComponentFixture<AddICComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddICComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddICComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
