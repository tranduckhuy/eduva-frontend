import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateOtpVerifyFormComponent } from './activate-otp-verify-form.component';

describe('ActivateOtpVerifyFormComponent', () => {
  let component: ActivateOtpVerifyFormComponent;
  let fixture: ComponentFixture<ActivateOtpVerifyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateOtpVerifyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateOtpVerifyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
