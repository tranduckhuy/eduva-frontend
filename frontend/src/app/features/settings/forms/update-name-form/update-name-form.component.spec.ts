import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNameFormComponent } from './update-name-form.component';

describe('UpdateNameFormComponent', () => {
  let component: UpdateNameFormComponent;
  let fixture: ComponentFixture<UpdateNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateNameFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
