import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormRegisterComponent } from './auth-form-register.component';

describe('AuthFormRegisterComponent', () => {
  let component: AuthFormRegisterComponent;
  let fixture: ComponentFixture<AuthFormRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
