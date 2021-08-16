import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityAreaComponent } from './quality-area.component';

describe('QualityAreaComponent', () => {
  let component: QualityAreaComponent;
  let fixture: ComponentFixture<QualityAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
