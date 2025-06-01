import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSocialFormComponent } from './update-social-form.component';

describe('UpdateSocialFormComponent', () => {
  let component: UpdateSocialFormComponent;
  let fixture: ComponentFixture<UpdateSocialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSocialFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSocialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
