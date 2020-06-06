import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycSnackbarComponent } from './kyc-snackbar.component';

describe('KycSnackbarComponent', () => {
  let component: KycSnackbarComponent;
  let fixture: ComponentFixture<KycSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
