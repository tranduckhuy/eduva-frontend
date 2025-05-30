import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTracksComponent } from './sidebar-tracks.component';

describe('SidebarTracksComponent', () => {
  let component: SidebarTracksComponent;
  let fixture: ComponentFixture<SidebarTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTracksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
