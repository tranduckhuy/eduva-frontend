import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRedirectComponent } from './settings-redirect.component';

describe('SettingsRedirectComponent', () => {
  let component: SettingsRedirectComponent;
  let fixture: ComponentFixture<SettingsRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
