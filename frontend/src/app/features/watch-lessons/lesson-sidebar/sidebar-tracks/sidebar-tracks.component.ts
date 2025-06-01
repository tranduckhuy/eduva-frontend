import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SidebarTrackComponent } from './sidebar-track/sidebar-track.component';

@Component({
  selector: 'sidebar-tracks',
  standalone: true,
  imports: [SidebarTrackComponent],
  templateUrl: './sidebar-tracks.component.html',
  styleUrl: './sidebar-tracks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTracksComponent {}
