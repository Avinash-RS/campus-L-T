import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfreaderComponent } from './pdfreader.component';

describe('PdfreaderComponent', () => {
  let component: PdfreaderComponent;
  let fixture: ComponentFixture<PdfreaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfreaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
