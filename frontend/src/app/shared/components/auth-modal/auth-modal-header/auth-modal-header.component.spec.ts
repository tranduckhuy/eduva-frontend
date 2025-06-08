import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalHeaderComponent } from './auth-modal-header.component';

describe('AuthModalHeaderComponent', () => {
  let component: AuthModalHeaderComponent;
  let fixture: ComponentFixture<AuthModalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModalHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthModalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
