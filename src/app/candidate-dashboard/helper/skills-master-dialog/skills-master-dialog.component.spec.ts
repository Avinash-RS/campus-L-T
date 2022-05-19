import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsMasterDialogComponent } from './skills-master-dialog.component';

describe('SkillsMasterDialogComponent', () => {
  let component: SkillsMasterDialogComponent;
  let fixture: ComponentFixture<SkillsMasterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsMasterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
