import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFacebookFormComponent } from './update-facebook-form.component';

describe('UpdateFacebookFormComponent', () => {
  let component: UpdateFacebookFormComponent;
  let fixture: ComponentFixture<UpdateFacebookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFacebookFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFacebookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
