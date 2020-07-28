import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelShortlistComponent } from './second-level-shortlist.component';

describe('SecondLevelShortlistComponent', () => {
  let component: SecondLevelShortlistComponent;
  let fixture: ComponentFixture<SecondLevelShortlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelShortlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
