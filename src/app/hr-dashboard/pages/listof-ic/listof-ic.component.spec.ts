import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofICComponent } from './listof-ic.component';

describe('ListofICComponent', () => {
  let component: ListofICComponent;
  let fixture: ComponentFixture<ListofICComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListofICComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofICComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
