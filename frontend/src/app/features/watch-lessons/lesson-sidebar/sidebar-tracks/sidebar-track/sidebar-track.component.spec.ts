import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTrackComponent } from './sidebar-track.component';

describe('SidebarTrackComponent', () => {
  let component: SidebarTrackComponent;
  let fixture: ComponentFixture<SidebarTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
