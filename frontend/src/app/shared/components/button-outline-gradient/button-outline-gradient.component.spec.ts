import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonOutlineGradientComponent } from './button-outline-gradient.component';

describe('ButtonOutlineGradientComponent', () => {
  let component: ButtonOutlineGradientComponent;
  let fixture: ComponentFixture<ButtonOutlineGradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonOutlineGradientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonOutlineGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
