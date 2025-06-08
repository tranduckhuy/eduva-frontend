import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalFooterComponent } from './auth-modal-footer.component';

describe('AuthModalFooterComponent', () => {
  let component: AuthModalFooterComponent;
  let fixture: ComponentFixture<AuthModalFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModalFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthModalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
