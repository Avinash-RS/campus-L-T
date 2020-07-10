import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoUserManagementComponent } from './tpo-user-management.component';

describe('TpoUserManagementComponent', () => {
  let component: TpoUserManagementComponent;
  let fixture: ComponentFixture<TpoUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
