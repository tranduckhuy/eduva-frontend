import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormForgotPasswordComponent } from './auth-form-forgot-password.component';

describe('AuthFormForgotPasswordComponent', () => {
  let component: AuthFormForgotPasswordComponent;
  let fixture: ComponentFixture<AuthFormForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
