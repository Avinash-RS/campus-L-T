import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcAddorListComponent } from './ic-addor-list.component';

describe('IcAddorListComponent', () => {
  let component: IcAddorListComponent;
  let fixture: ComponentFixture<IcAddorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcAddorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcAddorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
