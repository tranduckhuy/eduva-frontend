import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormResetPasswordComponent } from './auth-form-reset-password.component';

describe('AuthFormResetPasswordComponent', () => {
  let component: AuthFormResetPasswordComponent;
  let fixture: ComponentFixture<AuthFormResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
