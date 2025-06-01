import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhoneNumberFormComponent } from './update-phone-number-form.component';

describe('UpdatePhoneNumberFormComponent', () => {
  let component: UpdatePhoneNumberFormComponent;
  let fixture: ComponentFixture<UpdatePhoneNumberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePhoneNumberFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePhoneNumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
