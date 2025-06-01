import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvatarFormComponent } from './update-avatar-form.component';

describe('UpdateAvatarFormComponent', () => {
  let component: UpdateAvatarFormComponent;
  let fixture: ComponentFixture<UpdateAvatarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAvatarFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAvatarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
