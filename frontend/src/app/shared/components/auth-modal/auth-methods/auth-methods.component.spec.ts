import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMethodsComponent } from './auth-methods.component';

describe('AuthMethodsComponent', () => {
  let component: AuthMethodsComponent;
  let fixture: ComponentFixture<AuthMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMethodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
