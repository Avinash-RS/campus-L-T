import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAddedListComponent } from './skills-added-list.component';

describe('SkillsAddedListComponent', () => {
  let component: SkillsAddedListComponent;
  let fixture: ComponentFixture<SkillsAddedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsAddedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsAddedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
