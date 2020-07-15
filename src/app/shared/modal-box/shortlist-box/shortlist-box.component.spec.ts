import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistBoxComponent } from './shortlist-box.component';

describe('ShortlistBoxComponent', () => {
  let component: ShortlistBoxComponent;
  let fixture: ComponentFixture<ShortlistBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortlistBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
