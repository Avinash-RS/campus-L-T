import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyAreasComponent } from './competency-areas.component';

describe('CompetencyAreasComponent', () => {
  let component: CompetencyAreasComponent;
  let fixture: ComponentFixture<CompetencyAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
