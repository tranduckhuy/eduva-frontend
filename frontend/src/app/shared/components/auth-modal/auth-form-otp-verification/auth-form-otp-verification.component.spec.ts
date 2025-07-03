import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormOtpVerificationComponent } from './auth-form-otp-verification.component';

describe('AuthFormOtpVerificationComponent', () => {
  let component: AuthFormOtpVerificationComponent;
  let fixture: ComponentFixture<AuthFormOtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormOtpVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
